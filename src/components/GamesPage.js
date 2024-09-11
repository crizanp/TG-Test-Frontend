import React from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa"; // Importing the lock icon from react-icons
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
  justify-content: center;
  align-items: center;
  padding: 73px 20px;
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
  justify-content: center;
`;

const GameItem = styled(Link)`
  background-color: rgba(31, 31, 31, 0.85); // Transparent dark background for a glassy effect
  padding: 30px 20px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;  // Centering content vertically
  align-items: center;  // Centering content horizontally
  color: white;
  text-decoration: none;
  font-size: 22px;  // Increased text size
  text-align: center;
  transition: transform 0.3s, background-color 0.3s, box-shadow 0.3s;
  backdrop-filter: blur(10px);
  position: relative;  // Relative positioning to align the lock icon

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

  ${({ locked }) =>
    locked &&
    `
    position: relative;
    pointer-events: none; // Prevents clickability
    &:hover {
      transform: none;
      background-color: rgba(31, 31, 31, 0.85); // No hover effect when locked
      box-shadow: none;
    }
  `}
`;

// Lock icon styling on the left with silver color
const LockIcon = styled(FaLock)`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  font-size: 40px;
  color: #c0c0c0;  // Silver color for lock
`;

// Dimmed styling for locked items
const DimmedIconWrapper = styled.div`
  font-size: 80px;  // Icon size
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.2);  // More dimmed icon color
  display: flex;
  justify-content: center;  // Horizontal centering
  align-items: center;  // Vertical centering
  height: 100px;  // Set a fixed height for proper vertical alignment
`;

const DimmedText = styled.div`
  color: rgba(255, 255, 255, 0.3); // More dimmed text color
`;

const IconWrapper = styled.div`
  font-size: 80px;  // Icon size
  margin-bottom: 10px;
  color: #00bfff;
  display: flex;
  justify-content: center;  // Horizontal centering
  align-items: center;  // Vertical centering
  height: 100px;  // Set a fixed height for proper vertical alignment
`;

const GameTitle = styled.h2`
  font-size: 40px;  // Made title quite big
  font-weight: bold;
  margin-bottom: 20px;
  color: #cad2d5;
`;

const GameDescription = styled.p`
  font-size: 16px;  // Made description smaller
  color: #cfcfcf;
  max-width: 600px;
`;

const ComingSoonText = styled.small`
  font-style: italic;
  color: grey;
`;

const GameIcon = styled.img`
  width: 100px;  // Increased logo size
  height: 100px;  // Increased logo size
  margin-bottom: 20px;  // Added some space below the icon
`;

// GamesPage Component
function GamesPage() {
  return (
    <GamesContainer>
      <UserInfo />
      <GameTitle>Choose Your Game</GameTitle>
      <GameDescription>
        Play and earn points by completing exciting challenges!
      </GameDescription>
      <GameList>
        {/* Quiz Game - Locked */}
        <GameItem locked>
          <LockIcon /> {/* Displaying the lock icon at the left */}
          <DimmedIconWrapper>
            <GameIcon src="https://i.postimg.cc/Nf97MvkN/Quiz.png" alt="Quiz Icon" />
          </DimmedIconWrapper>
          <div>Quiz</div>
          <small>Test your knowledge!</small>
        </GameItem>

        {/* Spin the Wheel */}
        <GameItem to="/spin-wheel">
          <IconWrapper>
            <GameIcon src="https://i.postimg.cc/Kv673p9m/Spinwheel.png" alt="Spin the Wheel Icon" />
          </IconWrapper>
          <div>Spin the Wheel</div>
          <small>Spin and win points!</small>
        </GameItem>

        {/* Treasure Hunt - Locked */}
        <GameItem locked>
          <LockIcon /> {/* Displaying the lock icon at the left */}
          <DimmedIconWrapper>
            <GameIcon src="https://i.postimg.cc/XY9ffKhd/treasure-hunt.png" alt="Treasure Hunt Icon" />
          </DimmedIconWrapper>
          <div>Treasure Hunt</div>
          <small>Uncover hidden treasures and win big reward!</small>
        </GameItem>

        {/* Coming Soon Game */}
        <GameItem comingSoon>
          <IconWrapper>
            <GameIcon src="https://i.postimg.cc/J7d5MzZD/Comin-soon.png" alt="Coming Soon Icon" />
          </IconWrapper>
          <div>Coming Soon</div>
          <ComingSoonText>More games on the way!</ComingSoonText>
        </GameItem>
      </GameList>
    </GamesContainer>
  );
}

export default GamesPage;
