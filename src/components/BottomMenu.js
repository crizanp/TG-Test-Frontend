import React from 'react';
import styled from 'styled-components';
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
    padding: 8px 0;
    font-size: 12px;
  }
`;

const MenuItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-size: 14px;
  padding: 5px 0;
  text-decoration: none;

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 4px 0;
  }
`;

const MenuLabel = styled.div`
  font-size: 12px;
  margin-top: 5px;

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

function BottomMenu() {
  return (
    <BottomMenuContainer>
      <MenuItem to="/friend">
        <FaUserFriends size={24} />
        <MenuLabel>Friend</MenuLabel>
      </MenuItem>
      <MenuItem to="/earn">
        <FaCoins size={24} />
        <MenuLabel>Earn</MenuLabel>
      </MenuItem>
      <MenuItem to="/ecosystem">
        <FaGlobe size={24} />
        <MenuLabel>Ecosystem</MenuLabel>
      </MenuItem>
      <MenuItem to="/airdrop">
        <FaGift size={24} />
        <MenuLabel>Airdrop</MenuLabel>
      </MenuItem>
      <MenuItem to="/">
        <FaHome size={24} />
        <MenuLabel>Home</MenuLabel>
      </MenuItem>
    </BottomMenuContainer>
  );
}

export default BottomMenu;
