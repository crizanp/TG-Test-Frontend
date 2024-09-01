import styled, { keyframes, css } from 'styled-components';

// Define the missing keyframes animations
const slapEffectAnimation = keyframes`
  0% {
    transform: scale(1) translateY(0) translateX(0);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) translateY(-8px) translateX(8px);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.5) translateY(-16px) translateX(-16px);
    opacity: 0;
  }
`;

const bounceAnimation = keyframes`
  0% { transform: scale(1); }
  25% { transform: scale(1.02); }
  50% { transform: scale(1); }
`;

const pointsAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
`;

const pointFlyingAnimation = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-60px) scale(1.5); /* Increased scale for better visibility */
  }
`;

// Styled components with animations
export const HomeContainer = styled.div`
  font-family: 'Orbitron', sans-serif;
  color: white;
  background: radial-gradient(circle, #523B7A, #222325);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  min-height: 87vh;
  overflow: hidden;
  user-select: none;
  padding: 20px 20px;
  position: relative;
`;

export const PointsDisplayContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 64px;
  margin-bottom: 20px;
`;

export const PointsDisplay = styled.div`
  font-size: 50px;
  color: white;
  display: flex;
  align-items: center;
  font-weight: bold;
`;

export const DollarIcon = styled.img`
  width: 48px;
  height: 48px;
  margin-right: 10px;
`;

export const MiddleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  position: relative;
`;

export const Message = styled.div`
  padding: 10px 20px;
  font-size: 22px;
  margin-bottom: 10px;
  font-weight: bold;
  color: white;
  text-transform: uppercase;

  @media (max-width: 480px) {
    font-size: 18px;
    margin-bottom: 10px;
  }
`;

export const EagleContainer = styled.div`
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
`;

export const EagleImage = styled.img`
  width: 270px;
  height: auto;
  cursor: pointer;
  transition: transform 0.1s ease-in-out;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    transform: scale(1.05);
  }

  ${({ $animate }) =>
    $animate &&
    css`
      animation: ${bounceAnimation} 0.3s ease-in-out;
    `}
`;

export const Description = styled.div`
  font-size: 16px;
  margin-top: 10px;
  margin-bottom: 20px;
  line-height: 1.6;
  color: white;
  max-width: 100%;
  text-align: center;

  & span {
    font-weight: bolder;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

export const FlyingNumber = styled.div`
  position: absolute;
  font-size: 28px; /* Increased font size for better visibility */
  color: #ffd700;
  animation: ${pointFlyingAnimation} 1s ease-in-out;
  top: ${({ y }) => `${y}px`};
  left: ${({ x }) => `${x}px`};
  z-index: 10;
  pointer-events: none;
  transform: translate(-50%, -100%);
`;

export const SlapEmoji = styled.div`
  position: absolute;
  top: ${({ y }) => y}px;
  left: ${({ x }) => x}px;
  font-size: 28px;
  color: #ffffff;
  z-index: 10;
  transform: translate(-50%, -50%);
  animation: ${slapEffectAnimation} 0.6s ease forwards;
`;
export const EnergyDisplay = styled.div`
  margin-top: 10px;
  font-size: 18px;
  color: #ffcc00;  // Adjust color to match your theme
  font-weight: bold;
`;
export const EnergyBarContainer = styled.div`
  width: 100%;
  height: 10px;
  background-color: #444; /* Background color of the bar */
  border-radius: 5px;
  margin-top: 10px;
  overflow: hidden; /* Ensures the inner bar doesn't overflow */
`;

export const EnergyBar = styled.div`
  height: 100%;
  background-color: #ffcc00; /* Color of the energy bar */
  width: ${(props) => props.energy}%; /* Dynamic width based on energy level */
  transition: width 0.3s ease-in-out; /* Smooth transition for energy changes */
`;