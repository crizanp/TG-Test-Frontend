import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { usePoints } from '../context/PointsContext';
import UserInfo from './UserInfo';

const EcosystemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1c1c1c;
  color: white;
  text-align: center;
  font-family: 'Arial, sans-serif';
  min-height: 100vh;
  padding-top: 70px;
  position: relative;
  overflow: hidden;
`;

const ScrollableContent = styled.div`
  width: 95%;
  max-width: 600px;
  padding: 20px;
  overflow-y: auto;
  -ms-overflow-style: none;  /* Internet Explorer and Edge */
  scrollbar-width: none;  /* Firefox */

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    -webkit-overflow-scrolling: touch;
  }
`;

const EcosystemBox = styled.div`
  background-color: #252525;
  border-radius: 15px;
  padding: 20px;
  margin: 10px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.8);
  }

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const SiteName = styled.h3`
  color: #ff9800;
  font-size: 20px;
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
  font-size: 16px;
  color: #cccccc;
  margin-bottom: 10px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const VisitButton = styled.button`
  background-color: ${({ disabled }) => (disabled ? 'grey' : '#ff9800')};
  color: white;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? 'grey' : '#ffb74d')};
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 8px 16px;
  }
`;

function EcosystemPage() {
  const { points, setPoints } = usePoints();
  const username = '@demo_username';
  const [processing, setProcessing] = useState(false);
  const [cooldowns, setCooldowns] = useState(() => {
    const storedCooldowns = localStorage.getItem('cooldowns');
    return storedCooldowns ? JSON.parse(storedCooldowns) : {};
  });
  const [now, setNow] = useState(Date.now());

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
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000); // Update the current time every second

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('cooldowns', JSON.stringify(cooldowns));
  }, [cooldowns]);

  const handleVisit = (url, index) => {
    if (processing || isCooldownActive(index)) return;

    setProcessing(true);
    window.open(url, '_blank');

    setTimeout(() => {
      setPoints((prevPoints) => prevPoints + 100);
      setProcessing(false);

      const cooldownEnd = Date.now() + 30 * 60 * 1000; // 30 minutes cooldown
      setCooldowns((prevCooldowns) => ({
        ...prevCooldowns,
        [index]: cooldownEnd,
      }));

      alert('100 points awarded for visiting the site!');
    }, 30000);
  };

  const isCooldownActive = (index) => {
    const cooldownEnd = cooldowns[index];
    return cooldownEnd && cooldownEnd > now;
  };

  const getCooldownTime = (endTime) => {
    const remainingTime = endTime - now;
    if (remainingTime <= 0) {
      return null;
    }
    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <EcosystemContainer>
      <UserInfo username={username} points={points} />

      <ScrollableContent>
        {ecosystems.map((site, index) => (
          <EcosystemBox key={index}>
            <SiteName>{site.name}</SiteName>
            <Url href={site.url} target="_blank" rel="noopener noreferrer">
              {site.url}
            </Url>
            <Description>{site.description}</Description>
            <VisitButton
              onClick={() => handleVisit(site.url, index)}
              disabled={isCooldownActive(index) || processing}
            >
              {isCooldownActive(index)
                ? `Paused: ${getCooldownTime(cooldowns[index])}`
                : processing
                ? 'Processing...'
                : 'Visit & Earn 100 Points'}
            </VisitButton>
          </EcosystemBox>
        ))}
      </ScrollableContent>
    </EcosystemContainer>
  );
}

export default EcosystemPage;
