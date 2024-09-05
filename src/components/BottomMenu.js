import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { FaParachuteBox, FaGamepad } from 'react-icons/fa';
import { GiReceiveMoney, GiHiveMind } from 'react-icons/gi';
import { SiEagle } from 'react-icons/si';

const BottomMenuContainer = styled.div`
  background-color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; 
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 400px;
  padding: 0px 0px 10px 0px; 
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
  padding-top: 5px;
`;

const MenuItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #dfcec0;
  font-size: 12px;
  text-decoration: none;
  padding: 10px; /* Increased padding for broader touch area */
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1); /* Slightly enlarge the icon on hover */
  }

  &:active {
    transform: scale(1.2); /* Scale effect when icon is clicked */
  }

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
  font-family: 'Poppins', sans-serif;
  font-size: 10px;
  font-weight: 600;
  margin-top: 3px;

  @media (max-width: 480px) {
    font-size: 8px;
  }
`;

const VibrationMenuItem = (props) => {
  const handleClick = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(100); // Trigger vibration for 100ms
    }
  };

  return (
    <MenuItem onClick={handleClick} {...props}>
      {props.children}
    </MenuItem>
  );
};

function BottomMenu() {
  const location = useLocation(); // Get current page location

  return (
    <BottomMenuContainer>
      <PoweredBy>
        Powered by{' '}
        <a href="https://icogemhunters.com" target="_blank" rel="noopener noreferrer">
          IGH Group [ ICOGEMHUNTERS ]
        </a>
      </PoweredBy>
      <MenuItems>
        <VibrationMenuItem to="/friend">
          <GiHiveMind size={location.pathname === '/friend' ? 24 : 20} color={location.pathname === '/friend' ? '#fff' : '#dfcec0'} />
          <MenuLabel>Friend</MenuLabel>
        </VibrationMenuItem>
        <VibrationMenuItem to="/earn">
          <GiReceiveMoney size={location.pathname === '/earn' ? 24 : 20} color={location.pathname === '/earn' ? '#fff' : '#dfcec0'} />
          <MenuLabel>Earn</MenuLabel>
        </VibrationMenuItem>
        <HomeMenuItem to="/home">
          <SiEagle size={location.pathname === '/home' ? 36 : 32} color={location.pathname === '/home' ? '#fff' : '#dfcec0'} />
          <MenuLabel>Home</MenuLabel>
        </HomeMenuItem>
        <VibrationMenuItem to="/airdrop">
          <FaParachuteBox size={location.pathname === '/airdrop' ? 24 : 20} color={location.pathname === '/airdrop' ? '#fff' : '#dfcec0'} />
          <MenuLabel>Airdrop</MenuLabel>
        </VibrationMenuItem>
        <VibrationMenuItem to="/games">
          <FaGamepad size={location.pathname === '/games' ? 24 : 20} color={location.pathname === '/games' ? '#fff' : '#dfcec0'} />
          <MenuLabel>Games</MenuLabel>
        </VibrationMenuItem>
      </MenuItems>
    </BottomMenuContainer>
  );
}

export default BottomMenu;
