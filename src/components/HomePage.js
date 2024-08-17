import React from 'react';
import styled from 'styled-components';

const HomeContainer = styled.div`
  text-align: center;
  color: white;
  background-color: #121212;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
`;

function HomePage() {
  return (
    <HomeContainer>
      <h1>Welcome to the Home Page</h1>
      <p>More features coming soon...</p>
    </HomeContainer>
  );
}

export default HomePage;
