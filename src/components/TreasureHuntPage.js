import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import UserInfo from './UserInfo';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #0a0a0a;
  color: white;
  min-height: 100vh;
  padding: 50px 20px;
  font-family: "Arial, sans-serif";
  text-align: center;
`;

const Icon = styled.img`
  width: 120px; 
  height: auto;
  margin-bottom: 20px;
  margin-top: 50px;

  animation: ${fadeIn} 1s ease;
`;

const Header = styled.h1`
  font-size: 50px;
  color: #e0d3d3;
  margin-bottom: 20px;
  font-weight: bold;
  animation: ${fadeIn} 1s ease;
`;

const TimerBox = styled.div`
  background-color: #1f1f1f;
  color: #aebcc2;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
  font-size: 22px;
  font-weight: bold;
`;

const WebsiteLink = styled.a`
  color: #aebcc2;
  font-size: 28px;
  text-decoration: underline;
  cursor: pointer;
  margin: 40px 0 20px;
  font-weight: bold;
`;

const InputBox = styled.input`
  width: 80%;
  max-width: 500px;
  padding: 18px;
  font-size: 26px;
  border: none;
  border-radius: 8px;
  background-color: #1f1f1f;
  color: white;
  margin-bottom: 30px;
  font-family: "Arial, sans-serif";
`;

const SubmitButton = styled.button`
  background-color: #0088cc;
  color: white;
  padding: 18px 35px;
  border-radius: 10px;
  font-size: 26px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  margin-bottom: 20px;
  font-family: "Arial, sans-serif";
  transition: background-color 0.3s;

  &:hover {
    background-color: #00aced;
  }

  &:disabled {
    background-color: grey;
  }
`;

const Leaderboard = styled.div`
  background-color: #1f2937;
  border-radius: 12px;
  padding: 20px;
  margin-top: 40px;
  width: 90%;
  max-width: 600px;
  color: #e0e0e0;
  animation: ${fadeIn} 1s ease;

  h2 {
    font-size: 32px;
    margin-bottom: 20px;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    font-size: 22px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
  }

  span {
    font-weight: bold;
    color: #aebcc2;
  }
`;

const InstructionContainer = styled.div`
  background-color: #1f2937a1;
  border-radius: 12px;
  padding: 25px;
  margin: 60px 0 30px;
  width: 90%;
  max-width: 700px;
  text-align: left;
  animation: ${fadeIn} 1s ease;

  h3 {
    font-size: 28px;
    color: #cad2d5;
    margin-bottom: 15px;
  }

  p {
    font-size: 18px;
    color: #cfcfcf;
    line-height: 1.6;
    margin-bottom: 10px;
  }

  strong {
    color: #e0d3d3;
  }
`;

// Custom Modal for Treasure Hunt Submission Confirmation
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #1f2937;
  color: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 500px;
  text-align: center;
  font-family: "Arial, sans-serif";
`;

const ModalButton = styled.button`
  background-color: #00aced;
  color: white;
  padding: 10px 20px;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0088cc;
  }
`;

// Timer function
const calculateTimeLeft = () => {
  const eventStartTime = new Date('2024-09-10T08:00:00Z'); // Starting time in UTC
  const eventEndTime = new Date('2024-09-10T16:00:00Z'); // Ending time in UTC
  const now = new Date();
  
  if (now > eventEndTime) {
    return 'Treasure Hunt is Over';
  }
  
  const difference = eventEndTime - now;
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

const TreasureHuntPage = () => {
  const [inputCode, setInputCode] = useState('');
  const [submitted, setSubmitted] = useState(false); // Tracks if the user has submitted the code
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    if (!submitted) { // Prevent resubmission
      setShowModal(true);
      setSubmitted(true); // Lock further submissions
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <Container>
      <UserInfo />

      {/* Icon above the header */}
      <Icon src="https://i.postimg.cc/XY9ffKhd/treasure-hunt.png" alt="Treasure Hunt Icon" />

      <Header>Treasure Hunt</Header>

      {/* Timer Box */}
      <TimerBox>
        Treasure Hunt Today: {timeLeft.hours || '0'}:{timeLeft.minutes || '00'}:{timeLeft.seconds || '00'} (Ends at 16:00 UTC)
      </TimerBox>

      <WebsiteLink href="https://example.com" target="_blank" rel="noopener noreferrer">
        Follow this link and find the code
      </WebsiteLink>

      <p style={{ color: '#cfcfcf', fontSize: '18px', marginBottom: '20px' }}>
        Search all active ICO lists and inside the content, there is a 5-digit code ending with an eagle emoji .
      </p>

      <InputBox
        type="text"
        placeholder="Enter the secret code..."
        value={inputCode}
        onChange={(e) => setInputCode(e.target.value)}
        disabled={submitted} // Disable input if already submitted
      />

      <SubmitButton onClick={handleSubmit} disabled={!inputCode || submitted}>
        {submitted ? 'Code Submitted' : 'Submit Code'}
      </SubmitButton>

      {/* Leaderboard for previous day’s results */}
      <Leaderboard>
        <h2>Leaderboard (Previous Day's Winners)</h2>
        <ul>
          <li>
            <span>Username1</span> - 10,000 Crowns
          </li>
          <li>
            <span>Username2</span> - 10,000 Crowns
          </li>
          <li>
            <span>Username3</span> - 10,000 Crowns
          </li>
          <li>
            <span>Username4</span> - 10,000 Crowns
          </li>
          <li>
            <span>Username5</span> - 10,000 Crowns
          </li>
          <li>
            <span>Username6</span> - 10,000 Crowns
          </li>
          <li>
            <span>Username7</span> - 10,000 Crowns
          </li>
          <li>
            <span>Username8</span> - 10,000 Crowns
          </li>
          <li>
            <span>Username9</span> - 10,000 Crowns
          </li>
          <li>
            <span>Username10</span> - 10,000 Crowns
          </li>
        </ul>
      </Leaderboard>

      {/* Instructions at the bottom */}
      <InstructionContainer>
        <h3>Instructions</h3>
        <p>
          Welcome to the Treasure Hunt! Your task is to find the secret code hidden somewhere on our website. Here’s how you can participate:
        </p>
        <p>
          <strong>1.</strong> Visit the website linked above and explore its pages carefully.
        </p>
        <p>
          <strong>2.</strong> Look for the 5 digit code in places like Links, description text, or even in the page images.
        </p>
        <p>
          <strong>3.</strong> Once you find the code, enter it in the field above and click submit.
        </p>
        <p>
          <strong>4.</strong> The first 10 users to submit the correct code will be awarded <strong>10,000 crowns</strong> each.
        </p>
        
        <p>
          After the submission period, the system will automatically select and display the top 10 winners in the leaderboard above.
        </p>
        <p>
          <strong>Note:</strong> Be fast and accurate! Once you submit, you cannot change your submission.
        </p>
      </InstructionContainer>

      {/* Custom Modal for code submission confirmation */}
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <h2>Code Submitted!</h2>
            <p>Your code has been successfully submitted. The first 10 users will be awarded after the event ends. Please wait for the fair distribution of the result.</p>
            <ModalButton onClick={closeModal}>Okay</ModalButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default TreasureHuntPage;
