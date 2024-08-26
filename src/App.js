import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PointsProvider } from './context/PointsContext';
import Layout from './components/Layout';
import TaskList from './components/TaskList';
import HomePage from './components/HomePage';
import EcosystemPage from './components/EcosystemPage';
import FriendPage from './components/FriendPage';
import AirdropPage from './components/AirdropPage';
import GamesPage from './components/GamesPage';
import SpinWheelPage from './components/SpinWheelPage';
import LoadingPage from './components/LoadingPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <PointsProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LoadingPage />} />

            {/* Protected Routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/earn"
              element={
                <ProtectedRoute>
                  <TaskList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ecosystem"
              element={
                <ProtectedRoute>
                  <EcosystemPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/friend"
              element={
                <ProtectedRoute>
                  <FriendPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/airdrop"
              element={
                <ProtectedRoute>
                  <AirdropPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/games"
              element={
                <ProtectedRoute>
                  <GamesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/spin-wheel"
              element={
                <ProtectedRoute>
                  <SpinWheelPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </PointsProvider>
  );
}

export default App;
