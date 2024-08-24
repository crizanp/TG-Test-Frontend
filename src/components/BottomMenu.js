import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { FaUserFriends, FaCoins, FaGlobe, FaHome, FaGift } from 'react-icons/fa';

const BottomMenuContainer = styled.div`
  background-color: #002a69;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Centers content vertically */
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 400px;
  padding: 0px 0px 10px  0px; /* Adjust padding as needed */
  margin: 0 auto;
  z-index: 10;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  @media (max-width: 480px) {
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

const PoweredBy = styled.div`
  background-color: #ffffff;
  color: #000000;
  width: 100%;
  text-align: center;
  padding: 5px 0;
  margin-bottom: 5px;
  font-size: 12px;

  a {
    color: #000000;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const MenuItems = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding-top: 5px; /* Add some space between PoweredBy and MenuItems */
`;

const MenuItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-size: 12px;
  text-decoration: none;

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const HomeMenuItem = styled(MenuItem)`
  font-size: 20px;
  transform: translateY(-5px);
  animation: ${pulseAnimation} 2s infinite;

  @media (max-width: 480px) {
    font-size: 14px;
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
      <PoweredBy>
        Powered by{' '}
        <a href="https://icogemhunters.com" target="_blank" rel="noopener noreferrer">
          IGH Group [ ICOGEMHUNTERS ]
        </a>
      </PoweredBy>
      <MenuItems>
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
        <MenuItem to="/games">
          <FaGlobe size={20} />
          <MenuLabel>Games</MenuLabel>
        </MenuItem>
      </MenuItems>
    </BottomMenuContainer>
  );
}

export default BottomMenu;
