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

function Layout({ children }) {
  const [showBottomMenu, setShowBottomMenu] = useState(false); // Initially hide the menu

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      console.log('Confirmed: Running inside Telegram');
      tg.expand(); // Expand to fullscreen, hiding the Telegram UI elements
      setShowBottomMenu(true); // Show the bottom menu only if in Telegram
    } else {
      console.log('Not confirmed: Running outside Telegram');
      setShowBottomMenu(false); // Ensure it remains hidden outside Telegram
    }
  }, []);

  return (
    <LayoutContainer>
      <Content>{children}</Content>
      {showBottomMenu && <BottomMenu />} {/* Render BottomMenu only if showBottomMenu is true */}
    </LayoutContainer>
  );
}

export default Layout;
