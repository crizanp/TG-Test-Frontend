import React, { useState } from 'react';
import styled, { keyframes, createGlobalStyle, css } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaParachuteBox, FaGamepad } from 'react-icons/fa';
import { GiReceiveMoney, GiHiveMind } from 'react-icons/gi';
import { SiEagle } from 'react-icons/si';

// Global styles for preventing long press pop-up and blue dim
const GlobalStyle = createGlobalStyle`
  * {
    -webkit-user-select: none; /* Disable text selection */
    -webkit-touch-callout: none; /* Disable long-press context menu */
    outline: none; /* Remove focus outline */
    -webkit-tap-highlight-color: transparent; /* Disable blue dim background */
  }
`;

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
    transform: scale(1.3);
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

const MenuItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #dfcec0;
  font-size: 12px;
  text-decoration: none;
  padding: 10px; /* Increased padding for broader touch area */
  transition: transform 0.2s ease;
  cursor: pointer;

  @media (max-width: 480px) {
    font-size: 10px;
  }

  ${({ isActive }) =>
    isActive &&
    css`
      animation: ${pulseAnimation} 1.5s infinite;
      transform: scale(1.5); /* Bigger scale for the clicked item */
      color: #fff;
    `}
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
      navigator.vibrate(50); // Softer vibration for 50ms
    }

    if (props.onClick) {
      props.onClick();
    }
  };

  return (
    <MenuItem onClick={handleClick} isActive={props.isActive}>
      {props.children}
      <MenuLabel>{props.label}</MenuLabel>
    </MenuItem>
  );
};


function BottomMenu() {
  const navigate = useNavigate(); // Get navigation function from React Router
  const location = useLocation(); // Get current page location
  const [activeMenu, setActiveMenu] = useState(location.pathname); // Track the currently active menu item

  const handleMenuClick = (path) => {
    setActiveMenu(path);
    navigate(path);
  };

  return (
    <>
      <GlobalStyle /> {/* Apply global styles */}
      <BottomMenuContainer>
        <PoweredBy>
          Powered by{' '}
          <a href="https://icogemhunters.com" target="_blank" rel="noopener noreferrer">
            IGH Group [ ICOGEMHUNTERS ]
          </a>
        </PoweredBy>
        <MenuItems>
          <VibrationMenuItem
            label="Friend"
            onClick={() => handleMenuClick('/friend')}
            isActive={activeMenu === '/friend'}
          >
            <GiHiveMind
              size={26}
              color={activeMenu === '/friend' ? '#fff' : '#dfcec0'}
            />
          </VibrationMenuItem>
          <VibrationMenuItem
            label="Earn"
            onClick={() => handleMenuClick('/earn')}
            isActive={activeMenu === '/earn'}
          >
            <GiReceiveMoney
              size={26}
              color={activeMenu === '/earn' ? '#fff' : '#dfcec0'}
            />
          </VibrationMenuItem>
          <VibrationMenuItem
            label="Home"
            onClick={() => handleMenuClick('/home')}
            isActive={activeMenu === '/home'}
          >
            <SiEagle
              size={26}
              color={activeMenu === '/home' ? '#fff' : '#dfcec0'}
            />
          </VibrationMenuItem>
          <VibrationMenuItem
            label="Airdrop"
            onClick={() => handleMenuClick('/airdrop')}
            isActive={activeMenu === '/airdrop'}
          >
            <FaParachuteBox
              size={26}
              color={activeMenu === '/airdrop' ? '#fff' : '#dfcec0'}
            />
          </VibrationMenuItem>
          <VibrationMenuItem
            label="Games"
            onClick={() => handleMenuClick('/games')}
            isActive={activeMenu === '/games'}
          >
            <FaGamepad
              size={26}
              color={activeMenu === '/games' ? '#fff' : '#dfcec0'}
            />
          </VibrationMenuItem>
        </MenuItems>
      </BottomMenuContainer>
    </>
  );
}

export default BottomMenu;
