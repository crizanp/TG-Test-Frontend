import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FriendPage = () => {
  const [userData, setUserData] = useState(null); // State to hold user data
  const [referralLink, setReferralLink] = useState(''); // State to hold referral link
  const [loading, setLoading] = useState(true); // State to handle loading

  useEffect(() => {
    // Initialize Telegram Web App
    window.Telegram.WebApp.ready();

    // Access Telegram Web App initialization data
    const telegramInitData = window.Telegram.WebApp.initDataUnsafe;
    const openerTelegramId = telegramInitData.user?.id; // Get user's Telegram ID
    const username = telegramInitData.user?.username; // Get user's Telegram username

    if (!openerTelegramId) {
      console.error('Telegram ID not available');
      setLoading(false);
      return;
    }

    // Register or fetch user information from the backend
    axios.post(`${process.env.REACT_APP_API_URL}/user-info/`, {
      userID: openerTelegramId,
      username,
      points: 0, // Initialize with 0 points
      tasksCompleted: [],
      taskHistory: [],
    })
    .then(response => {
      setUserData(response.data); // Store user data in state

      // Create referral link using the user's userID
      const botUsername = 'cizantest_bot'; // Replace with your actual bot username
      const link = `https://t.me/${botUsername}?start=${openerTelegramId}`;
      setReferralLink(link);
    })
    .catch(error => {
      console.error('Error fetching or registering user:', error);
      setUserData({ error: 'Failed to load user data.' }); // Set error state
    })
    .finally(() => {
      setLoading(false); // Stop loading
    });
  }, []);

  return (
    <div>
      <h1>Welcome to the Friend Page</h1>
      {loading ? (
        <p>Loading user data...</p> // Display loading message while data is being fetched
      ) : userData?.error ? (
        <p>{userData.error}</p> // Display error message if there was an error
      ) : (
        <div>
          <p>Username: {userData?.username || 'Anonymous'}</p>
          <p>Points: {userData?.points || 0}</p>
          <p>Your Referral Link:</p>
          <a href={referralLink} target="_blank" rel="noopener noreferrer">
            {referralLink}
          </a>
        </div>
      )}
    </div>
  );
};

export default FriendPage;
