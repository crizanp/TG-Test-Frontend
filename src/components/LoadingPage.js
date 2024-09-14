import React from 'react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('https://i.ibb.co/YhpdpCt/igh-tap-game.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover; /* Optionally cover the entire background */
`;

function LoadingPage() {
  return <LoadingContainer />;
}

export default LoadingPage;
