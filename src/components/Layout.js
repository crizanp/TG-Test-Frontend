import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BottomMenu from './BottomMenu';  // Make sure the path is correct
import LoadingPage from './LoadingPage';  // Make sure the path is correct

const LayoutContainer = styled.div`
  font-family: 'Arial, sans-serif';
  background-color: #090c12;
  max-width: 460px;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-x: hidden;
`;

const RestrictedContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  max-width: 460px;

  background-image: ${(props) => `url(${props.imageUrl})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow-x: hidden;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 60px;
  overflow-x: hidden;
`;

function Layout({ children }) {
  const [showBottomMenu, setShowBottomMenu] = useState(false);
  const [restricted, setRestricted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('https://i.postimg.cc/qBX0zdSb/igh-tap-game-2.jpg');  // Default image for restricted access
  const navigate = useNavigate();

  useEffect(() => {
    const isLocalhost = window.location.hostname === 'localhost';
    const tg = window.Telegram?.WebApp;

    if (isLocalhost) {
      // If running on localhost
      console.log('Running on localhost:3000');
      setShowBottomMenu(true);
      setLoading(false);
    } else if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      // Running inside Telegram
      const platform = tg.platform;
      if (platform === 'android' || platform === 'ios') {
        console.log('Confirmed: Running inside Telegram mobile app');
        tg.expand(); // Expand Telegram WebApp
        setShowBottomMenu(true);
        setLoading(false);

        // Disable vertical swipes to prevent the app from collapsing in mobile
        tg.disableVerticalSwipes();
      } else {
        // Restricted access for Telegram Web/Desktop
        console.log('Restricted: Running on Telegram Desktop or Web');
        setRestricted(true);
        setLoading(false);
      }
    } else {
      // Running outside Telegram
      console.log('Not confirmed: Running outside Telegram');
      setRestricted(true); // Restricted state for outside Telegram
      setLoading(false);
    }

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [navigate]);

  if (loading) {
    return <LoadingPage />;
  }

  if (restricted) {
    // Show image when outside Telegram or using Telegram Desktop/Web
    return <RestrictedContainer imageUrl={imageUrl} />;
  }

  // Only show BottomMenu after loading is done and if in Telegram mobile app
  return (
    <LayoutContainer>
      <Content>{children}</Content>
      {showBottomMenu && <BottomMenu />}
    </LayoutContainer>
  );
}

export default Layout;
