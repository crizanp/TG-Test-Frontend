// UserInfo.js

import React from 'react';
import styled from 'styled-components';
import { usePoints } from '../context/PointsContext';

// Telegram themed colors
const telegramBlue = "#0088cc";
const telegramLightBlue = "#36A8E5";

// User Info container with Telegram theme
const UserInfoContainer = styled.div`
  background-color: ${telegramBlue};
  color: white;
  padding: 8px 16px;
  border-radius: 25px;
  margin-top: 10px;
  max-width: 380px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 12px;
    max-width: 95%;
  }
`;

// Profile image styling
const ProfileImage = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
  border: 2px solid ${telegramLightBlue};
  
  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
  }
`;

// Username and Points section
const UserDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 15px; // Increased the gap between username and points display
`;

const Username = styled.div`
  color: white;
  font-weight: bold;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const Points = styled.div`
  background-color: ${telegramLightBlue};
  color: white;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const UserInfo = () => {
  const { points } = usePoints();
  
  // Fetching the first name and profile photo from Telegram WebApp API
  const firstName = window.Telegram.WebApp?.initDataUnsafe?.user?.first_name;
  const profilePhoto = window.Telegram.WebApp?.initDataUnsafe?.user?.photo_url;

  return (
    <UserInfoContainer>
      <UserDetails>
        {/* Conditionally show the profile image if it exists */}
        {profilePhoto && <ProfileImage src={profilePhoto} alt="Profile" />}

        {/* Display username and points */}
        <Username>Hi {firstName || 'User'}</Username>
      </UserDetails>

      {/* Display points with Telegram-style badge */}
      <Points>IGH: {Math.floor(points)}</Points>
    </UserInfoContainer>
  );
};

export default UserInfo;
