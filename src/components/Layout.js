import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import BottomMenu from './BottomMenu';

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

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 60px;
`;

const RestrictedMessage = styled.div`
  color: white;
  text-align: center;
  margin-top: 50%;
  font-size: 20px;
`;

function Layout({ children }) {
  const [showBottomMenu, setShowBottomMenu] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [restricted, setRestricted] = useState(false);

  useEffect(() => {
    const isLocalhost = window.location.hostname === 'localhost';
    const tg = window.Telegram?.WebApp;

    if (isLocalhost) {
      console.log('Running on localhost:3000');
      setShowBottomMenu(true); // Allow localhost for development purposes
    } else if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      const platform = tg.platform;

      if (platform === 'android' || platform === 'ios') {
        console.log('Confirmed: Running inside Telegram mobile app');
        tg.expand(); // Expand to fullscreen, hiding the Telegram UI elements
        setShowBottomMenu(true); // Show the bottom menu if in Telegram mobile app
      } else {
        console.log('Restricted: Running on Telegram Desktop or Web');
        setRestricted(true); // Restrict access if not on mobile app
      }
    } else {
      console.log('Not confirmed: Running outside Telegram');
      setRestricted(true); // Restrict access if not in Telegram or on localhost
    }

    // Delay showing the menu for 4 seconds
    const menuTimer = setTimeout(() => {
      setMenuVisible(true);
    }, 4000);

    return () => clearTimeout(menuTimer); // Clean up the timer if the component unmounts
  }, []);

  if (restricted) {
    return (
      <LayoutContainer>
        <RestrictedMessage>
          Access is restricted to the Telegram mobile app. Please switch to the Telegram mobile app to use this service.
        </RestrictedMessage>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer>
      <Content>{children}</Content>
      {showBottomMenu && menuVisible && <BottomMenu />} {/* Render BottomMenu after 4 seconds */}
    </LayoutContainer>
  );
}

export default Layout;
