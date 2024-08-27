import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BottomMenu from './BottomMenu';
import LoadingPage from './LoadingPage';

const LayoutContainer = styled.div`
  font-family: 'Arial, sans-serif';
  background-color: #05173e;
  max-width: 400px;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const RestrictedContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('https://i.postimg.cc/qBX0zdSb/igh-tap-game-2.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 60px;
`;

function Layout({ children }) {
  const [showBottomMenu, setShowBottomMenu] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [restricted, setRestricted] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isLocalhost = window.location.hostname === 'localhost';
    const tg = window.Telegram?.WebApp;

    if (isLocalhost) {
      console.log('Running on localhost:3000');
      setShowBottomMenu(true);
      setLoading(false); // Allow localhost and stop loading
      setMenuVisible(true); // Show the menu immediately after loading on localhost
    } else if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      const platform = tg.platform;

      if (platform === 'android' || platform === 'ios') {
        console.log('Confirmed: Running inside Telegram mobile app');
        tg.expand(); // Expand to fullscreen, hiding the Telegram UI elements
        setShowBottomMenu(true); // Show the bottom menu if in Telegram mobile app
        setLoading(false); // Stop loading
        setMenuVisible(true); // Show the menu immediately after loading on Telegram mobile app
      } else {
        console.log('Restricted: Running on Telegram Desktop or Web');
        setRestricted(true); // Restrict access if not on mobile app
        setLoading(false); // Stop loading
      }
    } else {
      console.log('Not confirmed: Running outside Telegram');
      setLoading(true); // Continue showing the loading page if outside Telegram

      // Delay showing the menu for 4 seconds only on the loading page
      const menuTimer = setTimeout(() => {
        setMenuVisible(true);
      }, 4000);

      return () => clearTimeout(menuTimer); // Clean up the timer if the component unmounts
    }
  }, [navigate]);

  if (loading) {
    return <LoadingPage />; // Show the loading page if still loading or outside Telegram
  }

  if (restricted) {
    return <RestrictedContainer />; // Show the background image if restricted
  }

  return (
    <LayoutContainer>
      <Content>{children}</Content>
      {showBottomMenu && menuVisible && <BottomMenu />} {/* Render BottomMenu after 4 seconds delay only on the loading page */}
    </LayoutContainer>
  );
}

export default Layout;
