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
  const [showBottomMenu, setShowBottomMenu] = useState(true);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      tg.expand(); // Expand to fullscreen, hiding the bottom menu
      setShowBottomMenu(false); // Hide the bottom menu
    }
  }, []);

  return (
    <LayoutContainer>
      <Content>{children}</Content>
      {showBottomMenu && <BottomMenu />}
    </LayoutContainer>
  );
}

export default Layout;
