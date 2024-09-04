import styled, { keyframes, css } from 'styled-components';
import { FaBolt } from 'react-icons/fa';

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

const pointFlyingAnimation = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-30px) scale(1.2); /* Reduced Y translation to fly less high */
  }
`;

export const HomeContainer = styled.div`
  font-family: 'Orbitron', sans-serif;
  background: linear-gradient(135deg, #1f1f1f, #2d2d2d);
  color: white;
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

export const PointsDisplayContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 64px;
  margin-bottom: 20px;
`;

export const PointsDisplay = styled.div`
  font-size: 50px;
  display: flex;
  align-items: center;
  font-weight: bold;
  color: #f2f2f2;
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
  width: 300px; 
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
  color: #ccc;
  max-width: 100%;
  text-align: center;
  font-weight: bold;

  & span {
    font-weight: bold;
    color: #fff; /* Pure white text for emphasis */
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

export const FlyingNumber = styled.div`
  position: absolute;
  font-size: 28px;
  color: #ffcc00;
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

export const EnergyIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3a3a3a;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin-right: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

export const EnergyIcon = styled(FaBolt)`
  width: 30px;
  height: 30px;
  color: #ffcc00;
  opacity: ${(props) => props.energy / 1000};
  transition: opacity 0.3s ease-in-out;
`;

export const EnergyCounter = styled.div`
  font-size: 14px;
  color: #fff;
  margin-left: 10px;
  white-space: nowrap;
`;
