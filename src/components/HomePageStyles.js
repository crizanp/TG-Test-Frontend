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

export const HomeContainer = styled.div`
  font-family: 'Orbitron', sans-serif;
  color: white;
  background: linear-gradient(135deg, #0072ff, #00c6ff);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  min-height: 89vh;
  overflow: hidden;
  user-select: none;
  padding: 10px 20px;  // Reduced padding to minimize gap
  position: relative;

  @media (max-width: 480px) {
    padding: 10px;
  }
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
  padding: 10px 20px; // Reduced padding to minimize gap
  font-size: 22px;
  margin-bottom: 10px; // Reduced margin to minimize gap
  font-weight: bold;
  color: #b82727;
  border-radius: 12px;
  text-transform: uppercase;

  @media (max-width: 480px) {
    font-size: 18px;
    margin-bottom: 10px;
  }
`;

export const EagleContainer = styled.div`
  background: radial-gradient(circle, #005cbf, #0078d7);
  padding: 15px; // Reduced padding for better proportion
  border-radius: 50%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;

  @media (max-width: 480px) {
    width: 202px;
    padding: 30px;
  }
`;

export const EagleImage = styled.img`
  width: 240px;
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
  margin-top: 10px; // Reduced margin to minimize gap
  line-height: 1.6;
  color: #ffffff;
  max-width: 80%;
  text-align: center;

  & span {
    color: #c0ff00;
    font-weight: bold;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

export const FlyingPoints = styled.div`
  position: absolute;
  font-size: 16px;
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
