import styled, { keyframes, css } from 'styled-components';
import { FaBolt } from 'react-icons/fa'; 

const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 6px #00aaff, 0 0 12px #00aaff, 0 0 18px #00aaff;
  }
  50% {
    box-shadow: 0 0 12px #00aaff, 0 0 18px #00aaff, 0 0 24px #00aaff;
  }
  100% {
    box-shadow: 0 0 6px #00aaff, 0 0 12px #00aaff, 0 0 18px #00aaff;
  }
`;

// Pulse animation 
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

export const HomeContainer = styled.div`
  font-family: 'Orbitron', sans-serif;
  color: #ffffff;
  background: #1e1e1e; /* Dark theme */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh; 
  overflow: hidden;
  user-select: none;
  position: relative;
`;

export const PointsDisplayContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px; 
`;

export const PointsDisplay = styled.div`
  font-size: 48px;
  color: #d3dfe5;
  display: flex;
  align-items: center;
  font-weight: bold;
`;

export const DollarIcon = styled.img`
  width: 36px;
  height: 36px;
  margin-right: 10px;
`;

export const MiddleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-top: 20px; 
`;

export const Message = styled.div`
  padding: 10px;
  font-size: 18px;
  margin-bottom: 12px;
  font-weight: bold;
  color: #bec6ca;
  text-transform: uppercase;
`;

export const EagleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

export const EagleImage = styled.img`
  width: 95%; 
  height: auto;
  cursor: pointer;
  transition: transform 0.1s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  ${({ $animate }) =>
    $animate &&
    css`
      animation: ${glowAnimation} 0.3s ease-in-out;
    `}
`;

export const EnergyIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #121212;
  border-radius: 50%;
  width: 45px;  
  height: 45px;
  margin-right: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  position: relative;
`;

export const EnergyIcon = styled(FaBolt)`
  width: 20px;
  height: 20px;
  color: #ffcc00;
`;

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

export const EnergyCircle = styled.svg`
  position: absolute;
  width: 80px;
    height: 80px;
`;

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
  stroke-dasharray: 250;
  stroke-dashoffset: ${({ energy }) => 250 - (energy / 1000) * 250};
  transition: stroke-dashoffset 0.3s ease, stroke 0.3s ease;
`;

export const EnergyCounter = styled.div`
  font-size: 18px;
    color: #171616;
    margin-left: 10px;
    background-color: rgb(36 160 220);
    padding: 8px 8px;
    border-radius: 15px;
    font-weight: bold;
`;

export const FlyingNumber = styled.div`
  position: absolute;
  font-size: 24px;
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
  font-size: 24px;
  color: #ffffff;
  z-index: 10;
  transform: translate(-50%, -50%);
  animation: ${slapEffectAnimation} 0.6s ease forwards;
`;
