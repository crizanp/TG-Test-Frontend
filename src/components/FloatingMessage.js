import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const FloatingMessageWrapper = styled.div`
  position: fixed;
  top: 25%; /* Position it at the top */
  left: 40%;
  transform: translateX(-50%);
  z-index: 1000;
  padding: 15px 30px;
  background-color: ${({ type }) => (type === "success" ? "#4CAF50" : "#F44336")}; /* Green for success, red for error */
  color: white;
  font-size: 18px;
  font-weight: bold;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: ${({ fade }) => (fade ? fadeOut : fadeIn)} 0.5s ease;
  opacity: ${({ fade }) => (fade ? 0 : 1)};
  transition: opacity 0.5s ease-in-out;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.span`
  margin-left: 15px;
  font-weight: bold;
  cursor: pointer;
`;

const FloatingMessage = ({ message, type, duration = 3000, onClose }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(() => {
        onClose();
      }, 500); // Time to complete fade-out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <FloatingMessageWrapper type={type} fade={fade}>
      {message}
      <CloseButton onClick={onClose}>&times;</CloseButton>
    </FloatingMessageWrapper>
  );
};

export default FloatingMessage;
