import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaUserFriends, FaCoins, FaGlobe, FaHome } from 'react-icons/fa';
import TaskList from './components/TaskList';
import HomePage from './components/HomePage';
import EcosystemPage from './components/EcosystemPage';
import FriendPage from './components/FriendPage';
import { PointsProvider } from './context/PointsContext'; // Import PointsProvider

const AppContainer = styled.div`
  font-family: 'Arial, sans-serif';
  ${'' /* background-color: #000000;
  padding: 20px; */}
  max-width: 400px;

  height:100vh;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 15px;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    padding: 10px;
    max-width: 100%;
  }
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

function App() {
  return (
    <PointsProvider>
      <Router>
        <AppContainer>
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
    </PointsProvider>
  );
}

export default App;
