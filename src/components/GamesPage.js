import React from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { FaQuestionCircle, FaWheelchair, FaGamepad, FaBoxOpen  } from "react-icons/fa"; // Added FaTreasureChest for Treasure Hunt
import UserInfo from './UserInfo';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled Components
const GamesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 73px 20px ;
  background-color: #121212;
  color: white;
  min-height: 87vh;
  text-align: center;
  background-image: url("/path-to-your-background-image.jpg");
  background-size: cover;
  background-position: center;
`;

const GameList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 30px;
  margin-top: 30px;
  animation: ${fadeIn} 1s ease;
  width: 100%;
  max-width: 1200px;
`;

const GameItem = styled(Link)`
  background-color: rgba(31, 31, 31, 0.85); // Transparent dark background for a glassy effect
  padding: 30px 20px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-decoration: none;
  font-size: 18px;
  text-align: center;
  transition: transform 0.3s, background-color 0.3s, box-shadow 0.3s;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-8px);
    background-color: #282828;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.8);
  }

  ${({ comingSoon }) =>
    comingSoon &&
    `
    background-color: #333;
    color: grey;
    cursor: default;
    &:hover {
      transform: none;
      background-color: #333;
      box-shadow: none;
    }
  `}
`;

const IconWrapper = styled.div`
  font-size: 60px;
  margin-bottom: 10px;
  color: #00bfff;
`;

const GameTitle = styled.h2`
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 20px;
  color:#cad2d5;
`;

const GameDescription = styled.p`
  font-size: 18px;
  color: #cfcfcf;
  max-width: 600px;
`;

const ComingSoonText = styled.small`
  font-style: italic;
  color: grey;
`;

// GamesPage Component
function GamesPage() {
  return (
    <GamesContainer>
    <UserInfo/>
      <GameTitle>Choose Your Game</GameTitle>
      <GameDescription>
        Play and earn points by completing exciting challenges!
      </GameDescription>
      <GameList>
        {/* Quiz Game */}
        <GameItem to="/ecosystem">
          <IconWrapper>
            <FaQuestionCircle />
          </IconWrapper>
          <div>Quiz</div>
          <small>Test your knowledge!</small>
        </GameItem>

        {/* Spin the Wheel */}
        <GameItem to="/spin-wheel">
          <IconWrapper>
            <FaWheelchair />
          </IconWrapper>
          <div>Spin the Wheel</div>
          <small>Spin and win points!</small>
        </GameItem>

        {/* Treasure Hunt - No link */}
        <GameItem comingSoon>
          <IconWrapper>
            <FaBoxOpen  />
          </IconWrapper>
          <div>Treasure Hunt</div>
          <ComingSoonText>Uncover hidden treasures soon!</ComingSoonText>
        </GameItem>

        {/* Coming Soon Game */}
        <GameItem comingSoon>
          <IconWrapper>
            <FaGamepad />
          </IconWrapper>
          <div>Coming Soon</div>
          <ComingSoonText>More games on the way!</ComingSoonText>
        </GameItem>
      </GameList>
    </GamesContainer>
  );
}

export default GamesPage;
