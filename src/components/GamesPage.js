import React from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";

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

const GamesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background-color: #0d2457;
  color: white;
  min-height: 87vh;
  text-align: center;
  background-image: url("/path-to-your-background-image.jpg"); // Add your background image path here
  background-size: cover;
  background-position: center;
`;

const GameList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px; /* Smaller gap between the boxes */
  margin-top: 30px;
  animation: ${fadeIn} 1s ease;
`;

const GameItem = styled(Link)`
  background-color: #1e1e1e;
  padding: 30px 20px; /* Increased padding for more space inside */
  border-radius: 15px;
  width: 170px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-decoration: none;
  font-size: 20px; /* Increased font size */
  text-align: center;
  transition: transform 0.2s, background-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);

  &:hover {
    transform: translateY(-10px);
    background-color: #ff9800;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
  }

  ${({ comingSoon }) =>
    comingSoon &&
    `
    background-color: #444;
    color: grey;
    cursor: default;
    &:hover {
      transform: none;
      background-color: #444;
      box-shadow: none;
    }
  `}
`;

const GameTitle = styled.h2`
  font-size: 36px; /* Increased font size */
  font-weight: bold;
  margin-bottom: 20px;
`;

const GameDescription = styled.p`
  font-size: 20px; /* Increased font size */
  color: #ff9800;
  max-width: 600px;
`;

function GamesPage() {
  return (
    <GamesContainer>
      <GameTitle>Choose Your Game</GameTitle>
      <GameDescription>
        Play and earn points by completing exciting challenges!
      </GameDescription>
      <GameList>
        <GameItem to="/ecosystem">
          <div>Quiz</div>
          <small>Test your knowledge!</small>
        </GameItem>
        <GameItem to="/spin-wheel">
          <div>Spin the Wheel</div>
          <small>Spin and win points!</small>
        </GameItem>
        <GameItem comingSoon>
          <div>Coming Soon</div>
          <small>More games on the way!</small>
        </GameItem>
      </GameList>
    </GamesContainer>
  );
}

export default GamesPage;
