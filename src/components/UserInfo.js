// src/components/UserInfo.js
import React from 'react';
import styled from 'styled-components';

const UserInfoContainer = styled.div`
  background-color: #4caf50;
  padding: 10px 30px;
  border-radius: 15px;
  margin: 25px 0px;
  display: flex;
  justify-content: space-between; /* This ensures space between the username and points */
  align-items: center;
  font-size: 18px;
  font-weight: bold;

  @media (max-width: 480px) {
    padding: 10px 15px;
    font-size: 16px;
  }
`;

const Username = styled.div`
  color: white;
  margin-right: 20px; /* Add some space between the username and points */
`;

const Points = styled.div`
  color: white;
`;

const UserInfo = ({ username, points }) => {
  return (
    <UserInfoContainer>
      <Username>{username}</Username>
      <Points>Points: {points.toFixed(2)}</Points>
    </UserInfoContainer>
  );
};

export default UserInfo;
