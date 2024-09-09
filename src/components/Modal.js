import React from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa"; // Importing the close button icon

// Modal background that covers the bottom half of the screen with blur and slide-up animation
const ModalBackground = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background-color: rgba(0, 0, 0, 0.85); // Dark background
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  animation: slideUp 0.5s ease-in-out forwards; // Smooth slide-up animation

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    height: 60%; // Increased height on smaller screens
  }
`;

// Modal content area for displaying crowns, description, and buttons
const ModalContent = styled.div`
  background-color: #1a1a1a;  // Dark background for modal
  padding: 25px;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.8); // Shadow for depth
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;

  @media (max-width: 480px) {
    padding: 15px;
    height: auto;
  }
`;

// Close button in the top-right corner of the modal
const CloseIcon = styled(FaTimes)`
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 24px;
  color: #f7f7f7;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

// Crown container for image and text
const CrownContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Crown image replacing the icon
const CrownImage = styled.img`
  width: 85px;
  height: 75px;
  margin-bottom: 10px;
`;

// Text showing crown points
const CrownText = styled.p`
  font-size: 26px;
  color: #ffbf00;
  font-weight: bold;
`;

// Description about the point deduction
const DescriptionText = styled.p`
  font-size: 16px;
  color: #f7f7f7;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

// Go ahead button for points deduction with hover effect
const GoAheadButton = styled.button`
  background-color: #3e9ed1;
  color: white;
  padding: 15px 25px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #a64ca6; 
    transform: scale(1.05); // Slight scaling effect on hover
  }

  &:disabled {
    background-color: grey;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    font-size: 23px;
    padding: 13px 20px;
    margin-bottom: 10px;
  }
`;

// Modal component that displays crown image, points deduction description, and buttons
const Modal = ({ onGoAhead, onClose }) => {
  return (
    <ModalBackground>
      <ModalContent>
        {/* Close button */}
        <CloseIcon onClick={onClose} />

        <CrownContainer>
          {/* Crown image instead of icon */}
          <CrownImage src="https://cdn-icons-png.flaticon.com/512/2244/2244513.png" alt="Crown" />
          <CrownText>50 Crowns</CrownText>
        </CrownContainer>

        {/* Short description about points deduction */}
        <DescriptionText>
          Viewing the correct answer will deduct 50 points from your total.
        </DescriptionText>

        <GoAheadButton onClick={onGoAhead}>Go Ahead </GoAheadButton>
      </ModalContent>
    </ModalBackground>
  );
};

export default Modal;
