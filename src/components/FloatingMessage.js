import React, { useState, useEffect } from 'react';
import { FloatingMessageContainer, MessageText, CloseButton } from './TaskList.styles'; // Adjust the path accordingly

const FloatingMessage = ({ message, type, duration = 3000, onClose }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(() => {
        onClose();
      }, 500); // Give time for fade-out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <FloatingMessageContainer type={type} $fade={fade}>
      <MessageText>{message}</MessageText>
      <CloseButton onClick={onClose}>×</CloseButton>
    </FloatingMessageContainer>
  );
};

export default FloatingMessage;
