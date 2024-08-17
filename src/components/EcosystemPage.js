import React from 'react';
import styled from 'styled-components';

const EcosystemContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  background-color: #121212;
  color: white;
  text-align: center;
  min-height: 100vh;
  font-family: Arial, sans-serif;
`;

const EcosystemBox = styled.div`
  background-color: #1e1e1e;
  border-radius: 10px;
  padding: 20px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, box-shadow 0.2s;
  user-select: none;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const SiteName = styled.h3`
  color: #ff9800;
  font-size: 18px;
  margin-bottom: 10px;
`;

const Url = styled.a`
  color: #4caf50;
  text-decoration: none;
  word-wrap: break-word;
  display: block;
  margin-bottom: 10px;

  &:hover {
    text-decoration: underline;
  }
`;

const Description = styled.p`
  font-size: 14px;
  color: #cccccc;
`;

function EcosystemPage() {
  const ecosystems = [
    {
      name: 'IGH Group Agency',
      url: 'https://ighgroup.io/',
      description: 'Our agency website.',
    },
    {
      name: 'IGH ICO Calendar',
      url: 'https://icogemhunters.com/',
      description: 'ICO/IDO/IEO listing platform.',
    },
    {
      name: 'IGH Cryptews',
      url: 'https://cryptews.com/',
      description: 'News aggregator platform.',
    },
    {
      name: 'IGH CoinMarketCap Profile',
      url: 'https://coinmarketcap.com/community/profile/icogemhunters',
      description: 'Our official CoinMarketCap profile.',
    },
    {
      name: 'IGH Twitter',
      url: 'https://twitter.com/icogemhunters',
      description: 'Follow us on Twitter.',
    },
    {
      name: 'IGH Telegram Group',
      url: 'https://t.me/ighgroup',
      description: 'Join our community.',
    },
    {
      name: 'IGH Telegram Channel',
      url: 'https://t.me/icogemhunters',
      description: 'Official updates and announcements.',
    },
    {
      name: 'IGH Gate.io Profile',
      url: 'https://www.gate.io/posts/homepage/CRkAAAoHXkNwUQoAHQlHDF9e',
      description: 'Our official Gate.io profile.',
    },
    {
      name: 'IGH Binance Profile',
      url: 'https://www.binance.com/en/square/profile/ighgroup',
      description: 'Our official Binance profile.',
    },
    {
      name: 'Maxis0 Telegram',
      url: 'https://t.me/maxis0',
      description: 'Partnerships and collaborations.',
    },
  ];

  return (
    <EcosystemContainer>
      {ecosystems.map((site, index) => (
        <EcosystemBox key={index}>
          <SiteName>{site.name}</SiteName>
          <Url href={site.url} target="_blank" rel="noopener noreferrer">{site.url}</Url>
          <Description>{site.description}</Description>
        </EcosystemBox>
      ))}
    </EcosystemContainer>
  );
}

export default EcosystemPage;
