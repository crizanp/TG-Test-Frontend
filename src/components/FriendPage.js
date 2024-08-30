import React, { useEffect, useState } from 'react';
import axios from 'axios';
 
const FriendPage = () => {
    const [userData, setUserData] = useState(null);
    const [referralLink, setReferralLink] = useState('');

    useEffect(() => {
        // Initialize Telegram Web App
        window.Telegram.WebApp.ready();

        // Access Telegram Web App initialization data
        const telegramInitData = window.Telegram.WebApp.initDataUnsafe;
        const openerTelegramId = telegramInitData.user.id; // Get user's Telegram ID
        const username = telegramInitData.user.username; // Get user's Telegram username

        // Register or fetch user information from the backend
        axios.post(`${process.env.REACT_APP_API_URL}/api/user-info/`, {
            userID: openerTelegramId,
            username: username,
            points: 0, // Initialize with 0 points
            tasksCompleted: [],
            taskHistory: [],
        }).then(response => {
            setUserData(response.data); // Store user data in state

            // Create referral link using the user's referral code
            const botUsername = 'ighgamebot'; // Replace with your actual bot username
            const referralCode = response.data.referralCode;
            const link = `https://t.me/${botUsername}?start=${referralCode}`;
            setReferralLink(link);
        }).catch(error => {
            console.error('Error fetching or registering user:', error);
        });
    }, []);

    return (
        <div>
            <h1>Welcome to the Friend Page</h1>
            {userData && (
                <div>
                    <p>Username: {userData.username}</p>
                    <p>Points: {userData.points}</p>
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
