import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PointsProvider } from './context/PointsContext';
import Layout from './components/Layout';
import TaskList from './components/TaskList';
import HomePage from './components/HomePage';
import EcosystemPage from './components/EcosystemPage';
import FriendPage from './components/FriendPage';
import AirdropPage from './components/AirdropPage';  // Import AirdropPage

function App() {
  return (
    <PointsProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/earn" element={<TaskList />} />
            <Route path="/ecosystem" element={<EcosystemPage />} />
            <Route path="/friend" element={<FriendPage />} />
            <Route path="/airdrop" element={<AirdropPage />} /> {/* Airdrop route */}
          </Routes>
        </Layout>
      </Router>
    </PointsProvider>
  );
}

export default App;
