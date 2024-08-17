import React from 'react';
import styled from 'styled-components';

const EcosystemContainer = styled.div`
  color: white;
  background-color: #121212;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
`;

const EcosystemItem = styled.div`
  margin-bottom: 20px;
`;

const EcosystemTitle = styled.h2`
  color: #ff9800;
`;

function EcosystemPage() {
  return (
    <EcosystemContainer>
      <EcosystemTitle>IGH Ecosystem</EcosystemTitle>
      <EcosystemItem>
        <h3>ICO Calendar</h3>
        <p>Description of ICO Calendar.</p>
      </EcosystemItem>
      <EcosystemItem>
        <h3>ICOGemHunters</h3>
        <p>Description of ICOGemHunters.</p>
      </EcosystemItem>
      <EcosystemItem>
        <h3>Cryptews</h3>
        <p>Description of Cryptews news aggregator platform.</p>
      </EcosystemItem>
      {/* Add more items as needed */}
    </EcosystemContainer>
  );
}

export default EcosystemPage;
