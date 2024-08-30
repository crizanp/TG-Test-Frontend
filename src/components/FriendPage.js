import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FriendPage = () => {
    const [userData, setUserData] = useState(null); // State to hold user data
    const [referralLink, setReferralLink] = useState(''); // State to hold referral link

    useEffect(() => {
        // Initialize Telegram Web App
        window.Telegram.WebApp.ready();

        // Access Telegram Web App initialization data
        const telegramInitData = window.Telegram.WebApp.initDataUnsafe;
        const openerTelegramId = telegramInitData.user.id; // Get user's Telegram ID
        const username = telegramInitData.user.username; // Get user's Telegram username

        console.log('Telegram ID:', openerTelegramId); // Debugging: Log Telegram ID
        console.log('Username:', username); // Debugging: Log username

        // Register or fetch user information from the backend
        axios.post(`${process.env.REACT_APP_API_URL}/user-info/`, {
            userID: openerTelegramId,
            username: username,
            points: 0, // Initialize with 0 points
            tasksCompleted: [],
            taskHistory: [],
        }).then(response => {
            console.log('User Data:', response.data); // Debugging: Log the response data
            setUserData(response.data); // Store user data in state

            // Create referral link using the user's referral code
            const botUsername = 'ighgamebot'; // Replace with your actual bot username
            const referralCode = response.data.referralCode;
            const link = `https://t.me/${botUsername}?start=${referralCode}`;
            setReferralLink(link);
            console.log('Referral Link:', link); // Debugging: Log the referral link
        }).catch(error => {
            console.error('Error fetching or registering user:', error);
            setUserData({ error: 'Failed to load user data.' }); // Set error state
        });
    }, []);

    return (
        <div>
            <h1>Welcome to the Friend Page</h1>
            {userData ? (
                userData.error ? (
                    <p>{userData.error}</p> // Display error message if there was an error
                ) : (
                    <div>
                        <p>Username: {userData.username}</p>
                        <p>Points: {userData.points}</p>
                        <p>Your Referral Link:</p>
                        <a href={referralLink} target="_blank" rel="noopener noreferrer">
                            {referralLink}
                        </a>
                    </div>
                )
            ) : (
                <p>Loading user data...</p> // Display loading message while data is being fetched
            )}
        </div>
    );
};

export default FriendPage;
