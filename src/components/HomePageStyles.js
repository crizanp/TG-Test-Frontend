import styled, { keyframes, css } from 'styled-components';

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

export const HomeContainer = styled.div`
  font-family: 'Orbitron', sans-serif;
  color: white;
  background-color: #0d2457;
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
  font-weight: bold;
  animation: ${({ $animate }) =>
    $animate &&
    css`
      ${pointsAnimation} 1s ease-in-out;
    `};
`;

export const DollarIcon = styled.img`
  width: 48px;
  height: 48px;
  margin-left: 10px;
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
  background-color: black;
  padding: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
`;

export const EagleImage = styled.img`
  width: 200px;
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
    color: #ffd700;
    font-weight: bold;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

export const FlyingPoints = styled.div`
  position: absolute;
  font-size: 16px;
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

export const HeaderText = styled.div`
  background-color: #1ea53e; /* Green background */
  color: black;
  font-size: 18px;
  padding: 5px 10px;
  border-radius: 12px;
  margin-bottom: 10px;
  font-weight: bold;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 80%;
  max-width: 300px;
`;
