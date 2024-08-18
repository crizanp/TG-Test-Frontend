import React from 'react';
import styled from 'styled-components';

const UserInfoContainer = styled.div`
  background-color: #4caf50;
  padding: 10px 20px;
  border-radius: 15px;
  margin-top: 15px; /* Add margin from the top */
  max-width: 400px;
  display: flex;
  justify-content: space-between; /* This ensures space between the username and points */
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  position: fixed;
  top: 0; /* Fix it to the top */
  z-index: 10;

  @media (max-width: 480px) {
    padding: 8px 15px;
    font-size: 12px;
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
