import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaUserFriends, FaCoins, FaGlobe, FaHome } from 'react-icons/fa';
import TaskList from './components/TaskList';
import HomePage from './components/HomePage';
import EcosystemPage from './components/EcosystemPage';
import FriendPage from './components/FriendPage';

const AppContainer = styled.div`
  font-family: 'Arial, sans-serif';
  background-color: #000000;
  
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
`;

const PointsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 18px;
`;

const TotalPoints = styled.div`
  font-weight: bold;
`;

const BottomMenu = styled.div`
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
`;

const MenuItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-size: 14px;
  padding: 5px 0;
  text-decoration: none;
`;

const MenuLabel = styled.div`
  font-size: 12px;
  margin-top: 5px;
`;

function App() {
  const totalPoints = 50;  // You have declared this variable but not used it in the current code


  return (
    <Router>
      <AppContainer>
        {/* <PointsContainer>
          <div>🌟 Total Points</div>
          <TotalPoints>{totalPoints}</TotalPoints>
        </PointsContainer> */}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/earn" element={<TaskList />} />
          <Route path="/ecosystem" element={<EcosystemPage />} />
          <Route path="/friend" element={<FriendPage />} />
        </Routes>

        <BottomMenu>
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
          <MenuItem to="/">
            <FaHome size={24} />
            <MenuLabel>Home</MenuLabel>
          </MenuItem>
        </BottomMenu>
      </AppContainer>
    </Router>
  );
}

export default App;
