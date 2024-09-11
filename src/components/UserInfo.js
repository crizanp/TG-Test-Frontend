import React from 'react';
import styled from 'styled-components';
import { FaRegGem } from 'react-icons/fa';  
import { usePoints } from '../context/PointsContext';

const UserInfoContainer = styled.div`
  color: white;
  background-color: black;
  padding: 5px 20px;  
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

const GemIcon = styled(FaRegGem)`
  color: #36a8e5;  
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
  
  // Keep the first 10 alphanumeric characters only
  firstName = firstName.split(/[^\w]+/)[0].slice(0, 10); 

  return (
    <UserInfoContainer>
      <Username>
        Hi {firstName}
      </Username>
      <PointsContainer>
        <GemIcon /> {Math.floor(points)} GEMS
      </PointsContainer>
    </UserInfoContainer>
  );
};

export default UserInfo;
