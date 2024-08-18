import React from 'react';
import styled from 'styled-components';
import BottomMenu from './BottomMenu'; // Import BottomMenu component

const LayoutContainer = styled.div`
  font-family: 'Arial, sans-serif';
  background-color: #121212;
  max-width: 400px;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 60px; /* Add padding to avoid content being covered by the bottom menu */
`;

function Layout({ children }) {
  return (
    <LayoutContainer>
      <Content>
        {children}
      </Content>
      <BottomMenu /> {/* Place BottomMenu at the bottom */}
    </LayoutContainer>
  );
}

export default Layout;
