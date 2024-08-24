// src/components/UserInfo.js
import React from 'react';
import styled from 'styled-components';
import { usePoints } from '../context/PointsContext';

const UserInfoContainer = styled.div`
  background-color: white;
  color: black;
  padding: 10px 20px;
  border-radius: 15px;
  margin-top: 15px;
  max-width: 400px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  position: fixed;
  top: 0;
  z-index: 10;

  @media (max-width: 480px) {
    padding: 8px 15px;
    font-size: 12px;
  }
`;

const Username = styled.div`
  color: black;
`;

// const Points = styled.div`
//   color: black;
// `;

const UserInfo = () => {
  const { userID, points } = usePoints(); // Access userID and points from context

  return (
    <UserInfoContainer>
      <Username>UId: {userID} | IGH: {Math.floor(points)}</Username>
      {/* <Points> IGH : {Math.floor(points)}</Points> */}
    </UserInfoContainer>
  );
};

export default UserInfo;
