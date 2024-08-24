import React from 'react';
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
  return (
    <LayoutContainer>
      <Content>{children}</Content>
      <BottomMenu />
    </LayoutContainer>
  );
}

export default Layout;
