import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { FaUserFriends, FaCoins, FaGlobe, FaHome, FaGift } from 'react-icons/fa';

const BottomMenuContainer = styled.div`
  background-color: #121212;
  padding: 10px 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  z-index: 10;

  @media (max-width: 768px) {
    flex-direction: row;
  }

  @media (max-width: 480px) {
    padding: 6px 0;
    font-size: 10px;
  }
`;

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
`;

const MenuItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-size: 12px;
  padding: 4px 0;
  text-decoration: none;

  @media (max-width: 480px) {
    font-size: 10px;
    padding: 3px 0;
  }
`;

const HomeMenuItem = styled(MenuItem)`
  font-size: 20px;
  transform: translateY(-5px);
  animation: ${pulseAnimation} 2s infinite;

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const MenuLabel = styled.div`
  font-size: 10px;
  margin-top: 3px;

  @media (max-width: 480px) {
    font-size: 8px;
  }
`;

function BottomMenu() {
  return (
    <BottomMenuContainer>
      <MenuItem to="/friend">
        <FaUserFriends size={20} />
        <MenuLabel>Friend</MenuLabel>
      </MenuItem>
      <MenuItem to="/earn">
        <FaCoins size={20} />
        <MenuLabel>Earn</MenuLabel>
      </MenuItem>
      <HomeMenuItem to="/">
        <FaHome size={32} />
        <MenuLabel>Home</MenuLabel>
      </HomeMenuItem>
      <MenuItem to="/airdrop">
        <FaGift size={20} />
        <MenuLabel>Airdrop</MenuLabel>
      </MenuItem>
      <MenuItem to="/ecosystem">
        <FaGlobe size={20} />
        <MenuLabel>Ecosystem</MenuLabel>
      </MenuItem>
    </BottomMenuContainer>
  );
}

export default BottomMenu;
