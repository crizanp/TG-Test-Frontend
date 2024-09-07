import React from 'react';
import styled from 'styled-components';
import { FaCrown } from 'react-icons/fa';  
import { usePoints } from '../context/PointsContext';

const UserInfoContainer = styled.div`
  background: #1c1c1c;  
  color: white;
  padding: 10px 20px;  
  border-radius: 25px;
  margin-top: 10px;
  width: 100%;
  max-width: 300px;  
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;  
  font-weight: bold;
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  border: 2px solid #0088cc; 

  @media (max-width: 480px) {
    padding: 8px 15px;
    font-size: 15px;
  }
`;

const Username = styled.div`
  display: flex;
  align-items: center;
`;

const CrownIcon = styled(FaCrown)`
  color: #ffd700;  
  margin-left: 8px;
  margin-right: 8px;
  font-size: 1.5rem;
`;

const PointsContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 8px 15px;
  font-size: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 17px;
    padding: 4px 9px;
  }
`;

const UserInfo = () => {
  const { points, username } = usePoints();
  
  // Get the first name from Telegram WebApp or 'User' as fallback
  let firstName = window.Telegram.WebApp?.initDataUnsafe?.user?.first_name || 'User';
  
  
  firstName = firstName.split(/[^\w]+/)[0]; // Stops at any non-alphanumeric character

  return (
    <UserInfoContainer>
      <Username>
        Hi {firstName}
      </Username>
      <PointsContainer>
        <CrownIcon /> {Math.floor(points)} Crowns
      </PointsContainer>
    </UserInfoContainer>
  );
};

export default UserInfo;
