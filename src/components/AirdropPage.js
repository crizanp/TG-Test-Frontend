import React from 'react';
import styled from 'styled-components';

const AirdropContainer = styled.div`
  color: white;
  background-color: #121212;
  padding: 20px;
  height: 100%;
  font-family: 'Arial', sans-serif;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const AirdropTitle = styled.h2`
  color: #ff9800;
  margin-bottom: 20px;
  text-align: center;
`;

const AirdropContent = styled.p`
  font-size: 16px;
  line-height: 1.5;
  color: #ffffff;
`;

function AirdropPage() {
  return (
    <AirdropContainer>
      <AirdropTitle>Current Airdrops</AirdropTitle>
      <AirdropContent>
        Participate in our latest airdrops to earn free tokens! Stay tuned for updates and opportunities.
      </AirdropContent>
      {/* Additional content for the airdrop can be added here */}
    </AirdropContainer>
  );
}

export default AirdropPage;
