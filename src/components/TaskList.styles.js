import styled, { keyframes, css } from "styled-components";
import { GiClockwork } from "react-icons/gi";
import { FaTimes } from "react-icons/fa"; // Importing the close button icon

// Slide in from right animation for floating message
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

// Fade out for floating message
const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

// Floating message container with responsive behavior and animations
export const FloatingMessageContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: ${({ type }) => (type === 'success' ? '#4caf50' : '#f44336')}; /* Green for success, red for error */
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${slideIn} 0.5s ease-out forwards, ${({ $fade }) => $fade && css`${fadeOut} 0.5s ease-out forwards`};

  @media (max-width: 480px) {
    width: 50%;
    right: 5%;
    top: 10px;
    padding: 10px 15px;
  }
`;

// Text for floating message
export const MessageText = styled.div`
  font-size: 16px;
  margin-right: 10px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

// Close button for floating message
export const CloseButton = styled.div`
  cursor: pointer;
  font-size: 20px;
  color: white;
  &:hover {
    opacity: 0.8;
  }
`;

// Task list container styling
export const TaskContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  color: white;
  padding-bottom: 80px;
  font-family: "Orbitron", sans-serif;
  min-height: 87vh;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    padding-bottom: 80px;
  }
`;

// Keyframe for spinning loading spinner
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled component for loading spinner
export const LoadingSpinner = styled.div`
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: ${spin} 2s linear infinite;
  margin: 100px auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Task category block with background and padding
export const TaskCategory = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: #fffbfb0a;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
`;

// Task title with uppercase and color
export const TaskTitle = styled.h3`
  color: #c2beb9;
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 18px;
  text-transform: uppercase;
`;

// Points display section with animated effect
export const PointsDisplayContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 85px;
`;

export const PointsDisplay = styled.div`
  font-size: 50px;
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  animation: ${({ $animate }) =>
    $animate &&
    css`
      ${pointsAnimation} 1s ease-in-out;
    `};
`;

export const DollarIcon = styled.img`
  width: 48px;
  height: 48px;
  margin-right: 10px;
`;

export const CoinText = styled.div`
  text-align: center;
  color: #ffffff;
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: bold;
`;

// Task item with hover effects and transitions
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

// Task details section
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

// Modal overlay with blur background and slide-up animation
const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;
const blurBackground = keyframes`
  from {
    backdrop-filter: blur(0px);
  }
  to {
    backdrop-filter: blur(8px);
  }
`;

// Modal overlay with background blur
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
  animation: ${blurBackground} 0.5s ease-in-out forwards;
  
  @media (max-width: 480px) {
    align-items: flex-end;
  }
`;

export const Modal = styled.div`
  background-color: #1c1c1e;
  color: white;
  padding: ${({ isKeyboardVisible }) => (isKeyboardVisible ? '10px' : '30px 20px')};
  border-radius: 12px 12px 0 0;
  width: ${({ $isClaimable }) => ($isClaimable ? '100%' : '100%')}; 
  max-width: ${({ $isClaimable }) => ($isClaimable ? '340px' : '100%')}; 
  height: ${({ isKeyboardVisible, $isClaimable }) => 
    isKeyboardVisible ? '80vh' 
    : $isClaimable ? '35vh' 
    : '55vh'};
  position: ${({ $isClaimable }) => ($isClaimable ? 'absolute' : 'relative')}; 
  top: ${({ $isClaimable }) => ($isClaimable ? '50%' : 'unset')}; 
  left: ${({ $isClaimable }) => ($isClaimable ? '50%' : 'unset')}; 
  transform: ${({ $isClaimable }) => ($isClaimable ? 'translate(-50%, -50%)' : 'unset')}; 
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: ${({ isKeyboardVisible }) => (isKeyboardVisible ? 'center' : 'space-between')};
  transition: height 0.4s ease-out, transform 0.4s ease-out, opacity 0.4s ease-out;

  @media (max-width: 768px) {
    padding: 25px 15px;
  }

  @media (max-width: 480px) {
    height: ${({ isKeyboardVisible, $isClaimable }) => 
      isKeyboardVisible ? '35vh' 
      : $isClaimable ? '35vh' 
      : '55vh'};
    padding: 20px;
    border-radius: 12px 12px 0 0;
  }
`;



// Large white title
export const ModalHeader = styled.div`
  font-size: 31px;
  color: #fff;
  font-weight: bold;
  text-align: center;
`;

// Description styling with proper spacing and color
export const ModalContent = styled.div`
  font-size: 17px;
    color: #ffffff;
    padding: 15px;
    background-color: rgb(255 255 255 / 4%);
    /* border: 1px solid rgba(255, 255, 255, 0.2); */
    border-radius: 8px;
    ${'' /* margin-bottom: 20px; */}

  @media (max-width: 480px) {
    font-size: 17px;
  }
`;

// Points display section with coin icon
export const PointsDisplayModal = styled.div`
  font-size: 26px;
  color: #f0a500;  // Yellow for points
  font-weight: bold;

  @media (max-width: 480px) {
    font-size: 26px;
    text-align:center;
  }
`;
// Coin icon with points display
export const CoinIcon = styled.img`
  width: 32px;
  height: 32px;
  margin-right: 10px;
`;

// Start Task Button with updated styles
export const ModalButton = styled.button`
  background-color: #0ea9a9;  // Purple background for the button
  color: white;
  border: none;
  padding: 15px 25px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #a64ca6;  // Lighten the purple on hover
    transform: scale(1.05);
  }

  &:disabled {
    background-color: grey;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    font-size: 24px;
    padding: 10px 20px;
  }
`;
// Red close button (icon)
export const CloseButtonModel = styled(FaTimes)`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 27px;
  cursor: pointer;
  color: #ffffff; // Red color for close button
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 480px) {
    font-size: 27px;
  }
`;
// Logo area (for the placeholder logo)
export const Logo = styled.img`
  width: 150px;
  height: 180px;
  margin: 0 auto 0px;
  object-fit: contain;
`;
// Reduce the excessive margins, apply hover effects for claim button
export const ClaimButton = styled.button`
  background-color: #ff416c;
  color: white;
  padding: 15px 25px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s, background-color 0.3s;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #ff4b2b;
    transform: scale(1.05);
  }

  &:disabled {
    background-color: grey;
    cursor: not-allowed;
  }
`;
// Adjust proof input field with minimal padding and focus state
export const ProofInput = styled.input`
  background-color: #333;
  border: 2px solid #b82bcb;
  padding: 10px;
  border-radius: 6px;
  color: white;
  margin-bottom: 15px;
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #ffb74d;
  }
`;
// Timer icon with rotating animation
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

// Points animation keyframe
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
