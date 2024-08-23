import styled, { keyframes } from 'styled-components';
import { GiClockwork } from 'react-icons/gi';

export const TaskContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #0072ff, #00c6ff);
  color: white;
  padding-bottom: 80px;
  font-family: 'Orbitron', sans-serif;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    padding-bottom: 80px;
  }
`;

export const TaskCategory = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: #00000026;
  padding: 20px;
  margin-bottom: 20px;
`;

export const TaskTitle = styled.h3`
  color: #241d12;
  margin-bottom: 20px;
  margin-top: 4px;
  text-align: center;
  font-weight: bold;
  font-size: 22px;
  text-transform: uppercase;
`;

export const CoinLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 45px;
  margin-bottom: 10px;
  font-size: 64px;
`;

export const CoinText = styled.div`
  text-align: center;
  color: #ffffff;
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: bold;
`;

export const TaskItem = styled.div`
  background-color: #1e1e1e;
  padding: 15px;
  margin: 10px 0;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.5);
  }

  ${({ $completed }) =>
    $completed &&
    `
    background-color: #2e7d32;
    cursor: default;
    &:hover {
      transform: none;
      box-shadow: none;
    }
  `}

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

export const TaskDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const TaskItemTitle = styled.div`
  font-size: 18px;
  color: #ffffff;
  margin-bottom: 5px;
  font-weight: bold;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

export const TaskPoints = styled.div`
  background-color: #ff9800;
  color: white;
  padding: 8px 12px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 16px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

export const TaskIcon = styled.div`
  font-size: 20px;
  color: #ffffff;

  ${({ $completed }) =>
    $completed &&
    `
    font-size: 16px;
    color: #ffffff;
    background-color: #2e7d32;
    padding: 8px 12px;
    border-radius: 12px;
  `}

  @media (max-width: 480px) {
    font-size: 18px;

    ${({ $completed }) =>
      $completed &&
      `
      font-size: 14px;
    `}
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: flex-end;

  @media (max-width: 480px) {
    align-items: center;
  }
`;

export const Modal = styled.div`
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 20px 20px 0 0;
  width: 100%;
  max-width: 400px;
  text-align: center;
  position: relative;

  @media (max-width: 768px) {
    padding: 15px;
    border-radius: 15px 15px 0 0;
  }

  @media (max-width: 480px) {
    padding: 10px;
    border-radius: 10px 10px 0 0;
  }
`;

export const ModalHeader = styled.div`
  font-size: 24px;
  color: #ff9800;
  margin-bottom: 20px;
  font-weight: bold;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

export const ModalContent = styled.div`
  font-size: 16px;
  color: white;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

export const ModalButton = styled.button`
  background-color: #ff9800;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ffb74d;
  }

  &:disabled {
    background-color: grey;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 10px 20px;
  }
`;

export const ClaimButton = styled(ModalButton)`
  background-color: green;
  margin-top: 20px;

  &:hover {
    background-color: #66bb6a;
  }

  &:disabled {
    background-color: grey;
    cursor: not-allowed;
  }
`;

export const CloseButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
  color: white;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

export const ProofInput = styled.input`
  background-color: #333;
  border: 2px solid #ff9800;
  padding: 12px;
  border-radius: 8px;
  width: calc(100% - 24px);
  color: white;
  margin-bottom: 20px;
  font-size: 18px;

  &:focus {
    outline: none;
    border-color: #ffb74d;
  }

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 16px;
  }
`;

export const PointsContainer = styled.div`
  background-color: #4caf50;
    padding: 10px 20px;
    border-radius: 15px;
    margin-top: 15px;
    max-width: 400px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    position: fixed;
    top: 0;
    z-index: 10;

  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 18px;
  }
`;

export const TotalPoints = styled.div`
  font-weight: bold;
`;

const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const TimerIcon = styled(GiClockwork)`
  font-size: 32px;
  color: #ff9800;
  animation: ${spinAnimation} 2s linear infinite;
  margin-top: 20px;

  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

export const TimerText = styled.div`
  color: #ff9800;
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;
