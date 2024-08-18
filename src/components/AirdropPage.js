import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

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
  font-size: 20px;
`;

const AirdropList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const AirdropCard = styled.div`
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    ${({ clickable }) =>
      clickable &&
      `
      transform: translateY(-3px);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
    `}
  }

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const AirdropName = styled.h3`
  color: #ff9800;
  font-size: 18px;
  margin: 0;
`;

const AirdropDesc = styled.p`
  font-size: 14px;
  color: #ffffff;
  margin: 0;
`;

const AirdropReward = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #4caf50;
  margin-top: 5px;
`;

const CountdownContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #252525;
  padding: 10px 15px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: bold;
  color: white;

  @media (max-width: 480px) {
    padding: 8px 12px;
  }
`;

const CountdownTimer = styled.div`
  font-size: 14px;
  color: ${({ active }) => (active ? '#ffeb3b' : '#ff9800')}; /* Yellow for active, orange for upcoming */
`;

const blinkAnimation = keyframes`
  50% {
    opacity: 0.5;
  }
`;

const TickingClock = styled.div`
  font-size: 20px;
  color: #ff9800;
  animation: ${blinkAnimation} 1s linear infinite;
`;

const airdropsData = [
  {
    name: "Airdrop 1",
    description: "Participate in Airdrop 1 for exclusive tokens.",
    reward: "500 IGH Tokens",
    startTime: Date.now() + 3600000 * 14, // 14 hours from now
    endTime: Date.now() + 3600000 * 48, // 48 hours from now
    link: "#",
  },
  {
    name: "Airdrop 2",
    description: "Join Airdrop 2 to earn free XYZ tokens.",
    reward: "200 MOUSE Tokens",
    startTime: Date.now() + 86400000 * 2, // 2 days from now
    endTime: Date.now() + 86400000 * 7, // 7 days from now
    link: "#",
  },
  {
    name: "Airdrop 3",
    description: "Get rewarded with ABC tokens in Airdrop 3.",
    reward: "300 CAT Tokens",
    startTime: Date.now() + 60000, // 1 minute from now
    endTime: Date.now() + 86400000 * 3, // 3 days from now
    link: "#",
  },
  {
    name: "Airdrop 4",
    description: "Earn DEF tokens by participating in Airdrop 4.",
    reward: "150 DOG Tokens",
    startTime: Date.now() + 86400000, // 1 day from now
    endTime: Date.now() + 86400000 * 4, // 4 days from now
    link: "#",
  },
  {
    name: "Airdrop 5",
    description: "Airdrop 5 offers you free GHI tokens.",
    reward: "100 RAT Tokens",
    startTime: Date.now() + 3600000 * 20, // 20 hours from now
    endTime: Date.now() + 86400000 * 5, // 5 days from now
    link: "#",
  },
];

const formatTime = (milliseconds) => {
  if (milliseconds > 86400000) {
    return `${Math.floor(milliseconds / 86400000)} day${Math.floor(milliseconds / 86400000) > 1 ? 's' : ''} left`;
  }
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

function AirdropPage() {
  const [airdrops, setAirdrops] = useState(airdropsData);

  useEffect(() => {
    const interval = setInterval(() => {
      setAirdrops((prevAirdrops) =>
        prevAirdrops.map((airdrop) => {
          const now = Date.now();
          let status = 'upcoming';
          let timeLeft = airdrop.startTime - now;
          
          if (now >= airdrop.startTime && now <= airdrop.endTime) {
            status = 'active';
            timeLeft = airdrop.endTime - now;
          }

          return { ...airdrop, status, timeLeft };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AirdropContainer>
      <AirdropTitle>Active & Upcoming Airdrops</AirdropTitle>
      <AirdropList>
        {airdrops.map((airdrop, index) => (
          <AirdropCard
            key={index}
            clickable={airdrop.status === 'active'}
            onClick={() => airdrop.status === 'active' && window.open(airdrop.link, '_blank')}
          >
            <AirdropName>{airdrop.name}</AirdropName>
            <AirdropDesc>{airdrop.description}</AirdropDesc>
            <AirdropReward>Reward: {airdrop.reward}</AirdropReward>
            <CountdownContainer>
              <CountdownTimer active={airdrop.status === 'active'}>
                {airdrop.status === 'active' ? 'Ends in: ' : 'Starts in: '}
                {formatTime(airdrop.timeLeft)}
              </CountdownTimer>
              <TickingClock>⏳</TickingClock>
            </CountdownContainer>
          </AirdropCard>
        ))}
      </AirdropList>
    </AirdropContainer>
  );
}

export default AirdropPage;
