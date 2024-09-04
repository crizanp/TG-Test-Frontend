import styled, { keyframes, css } from 'styled-components';
import { FaBolt } from 'react-icons/fa'; 

const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 6px #ffcc00, 0 0 12px #ffcc00, 0 0 18px #ffcc00;
  }
  50% {
    box-shadow: 0 0 12px #ffcc00, 0 0 18px #ffcc00, 0 0 24px #ffcc00;
  }
  100% {
    box-shadow: 0 0 6px #ffcc00, 0 0 12px #ffcc00, 0 0 18px #ffcc00;
  }
`;

// Pulse animation for energy container when low energy
const energyBarAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Flying number animation
const pointFlyingAnimation = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-60px) scale(1.5); 
  }
`;

// Slap emoji animation
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

// Container for the homepage
export const HomeContainer = styled.div`
  font-family: 'Orbitron', sans-serif;
  color: white;
  background: linear-gradient(to bottom, #1a1a1a, #0d0d0d); 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  min-height: 87vh;
  overflow: hidden;
  user-select: none;
  padding: 20px;
  position: relative;
`;

// Points display container
export const PointsDisplayContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 64px;
  margin-bottom: 20px;
`;

// Points display
export const PointsDisplay = styled.div`
  font-size: 50px;
  color: #fff;
  display: flex;
  align-items: center;
  font-weight: bold;
`;

// Dollar icon next to points
export const DollarIcon = styled.img`
  width: 48px;
  height: 48px;
  margin-right: 10px;
`;

// Middle section for eagle and energy bar
export const MiddleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  position: relative;
`;

// Message above the eagle
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

// Eagle container for displaying the eagle image
export const EagleContainer = styled.div`
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
`;

// Eagle image styling
export const EagleImage = styled.img`
  width: 100%; /* Make the image fill the container */
  height: auto; /* Maintain aspect ratio */
  cursor: pointer;
  transition: transform 0.1s ease-in-out;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    transform: scale(1.05);
  }

  ${({ $animate }) =>
    $animate &&
    css`
      animation: ${glowAnimation} 0.3s ease-in-out;
    `}
`;

// Description text styling
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

// Flying number animation
export const FlyingNumber = styled.div`
  position: absolute;
  font-size: 28px;
  color: #ffd700;
  animation: ${pointFlyingAnimation} 1s ease-in-out;
  top: ${({ y }) => `${y}px`};
  left: ${({ x }) => `${x}px`};
  z-index: 10;
  pointer-events: none;
  transform: translate(-50%, -100%);
`;

// Slap emoji that appears on tap
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

// Container for the energy icon and circle (glow reduced)
export const EnergyIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1f1f1f;
  border-radius: 50%;
  width: 70px;  
  height: 70px;
  margin-right: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  position: relative;

  ${({ energy }) =>
    energy > 800 &&
    css`
      ${'' /* animation: ${glowAnimation} 1.5s infinite ease-in-out; */}
    `}

  ${({ energy }) =>
    energy <= 200 &&
    css`
      animation: ${energyBarAnimation} 0.8s infinite ease-in-out;
    `}
`;


// Energy icon (bolt)
export const EnergyIcon = styled(FaBolt)`
  width: ${({ energy }) => (energy > 800 ? '40px' : '30px')};
  height: ${({ energy }) => (energy > 800 ? '40px' : '30px')};
  color: #ffcc00;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  transform: ${({ energy }) =>
    energy <= 200 ? 'scale(1.2)' : 'scale(1)'};
  opacity: ${(props) => props.energy / 1000}; 
`;

// Circular progress container for energy
export const EnergyProgressContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// SVG for circular progress
export const EnergyCircle = styled.svg`
  position: absolute;
  width: 80px;
  height: 80px;
`;

// Path for the circular energy progress
export const EnergyCirclePath = styled.circle`
  fill: none;
  stroke-width: 5;
  stroke: ${({ energy }) =>
    energy > 800
      ? 'limegreen'
      : energy > 500
      ? 'yellow'
      : energy > 200
      ? 'orange'
      : 'red'};
  stroke-linecap: round;
  stroke-dasharray: 250;
  stroke-dashoffset: ${({ energy }) => 250 - (energy / 1000) * 250};
  transition: stroke-dashoffset 0.3s ease, stroke 0.3s ease;
`;

// Update the EnergyCounter with a dim background
export const EnergyCounter = styled.div`
  font-size: 14px;
  color: #fff;
  margin-left: 10px;
  white-space: nowrap;
  background-color: rgba(0, 0, 0, 0.5); /* Dim background */
  padding: 5px 10px; /* Add some padding */
  border-radius: 5px; /* Rounded corners */
  font-weight: bold; /* Make the text bold */
`;