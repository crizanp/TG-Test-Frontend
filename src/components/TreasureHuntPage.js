import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import UserInfo from './UserInfo';
import { getUserID } from '../utils/getUserID'; // Import the getUserID utility


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

// Animations and Styled Components
// (Styled components here remain the same)

// Timer function to calculate time remaining
const calculateTimeLeft = (endTime) => {
  const eventEndTime = new Date(endTime); // Dynamic ending time from backend
  const now = new Date();

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
  const [settings, setSettings] = useState(null); // Settings from backend
  const [timeLeft, setTimeLeft] = useState({});
  const [leaderboard, setLeaderboard] = useState([]); // Leaderboard data
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState(''); // Store the fetched user ID
  const [username, setUsername] = useState(''); // Optional: Store username
  const [submittedCode, setSubmittedCode] = useState(null); // Store previously submitted code

  // Fetch userID from Telegram or mock on localhost
  useEffect(() => {
    const fetchUserID = async () => {
      try {
        const fetchedUserID = await getUserID(setUserID, setUsername); // Use getUserID to fetch userID
        console.log('Fetched User ID:', fetchedUserID);
      } catch (error) {
        console.error('Error fetching User ID:', error);
      }
    };

    fetchUserID();
  }, []);

  // Fetch Treasure Hunt settings and leaderboard from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch treasure hunt settings
        const settingsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/treasure-hunt-settings`);
        setSettings(settingsResponse.data);

        // Fetch leaderboard
        const leaderboardResponse = await axios.get(`${process.env.REACT_APP_API_URL}/treasure-hunt/leaderboard`);
        setLeaderboard(leaderboardResponse.data);

        setLoading(false); // Data is now loaded
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch user submission status and previously submitted code
  useEffect(() => {
    const checkUserSubmission = async () => {
      if (userID) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/treasure-hunt/check-submission/${userID}`);
          
          if (response.data.submitted) {
            setSubmitted(true); // Set the form to submitted state
            setSubmittedCode(response.data.code); // Store the previously submitted code
          }
        } catch (error) {
          console.error('Error checking user submission status:', error);
        }
      }
    };

    checkUserSubmission();
  }, [userID]);

  // Update timer every second
  useEffect(() => {
    if (settings) {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft(settings.endTime));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [settings]);

  const handleSubmit = async () => {
    if (!submitted && userID) { // Prevent resubmission and ensure userID is available
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/treasure-hunt/submit-treasure-hunt-code`, {
          userID: userID, // Use fetched userID here
          code: inputCode,
        });

        if (response.status === 200) {
          setShowModal(true);
          setSubmitted(true); // Lock further submissions
          setSubmittedCode(inputCode); // Set the submitted code
        }
      } catch (error) {
        console.error('Error submitting code:', error);
        alert('Submission failed. Please try again.');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <UserInfo userID={userID} username={username} /> {/* Pass userID and username to UserInfo */}

      {/* Icon above the header */}
      <Icon src="https://i.postimg.cc/XY9ffKhd/treasure-hunt.png" alt="Treasure Hunt Icon" />

      <Header>Treasure Hunt</Header>

      {/* Timer Box */}
      <TimerBox>
        Treasure Hunt Today: {timeLeft.hours || '0'}:{timeLeft.minutes || '00'}:{timeLeft.seconds || '00'} (Ends at {new Date(settings.endTime).toLocaleTimeString('en-US')} UTC)
      </TimerBox>

      <WebsiteLink href={settings.link} target="_blank" rel="noopener noreferrer">
        Follow this link and find the code
      </WebsiteLink>

      <p style={{ color: '#cfcfcf', fontSize: '18px', marginBottom: '20px' }}>
        {settings.shortDescription}
      </p>

      {submitted ? (
        <p style={{ color: '#00aced', fontSize: '22px', marginBottom: '20px' }}>
          You have already submitted the code: <strong>{submittedCode}</strong>
        </p>
      ) : (
        <>
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
        </>
      )}

      {/* Leaderboard for previous day’s results */}
      <Leaderboard>
        <h2>Leaderboard (Previous Day's Winners)</h2>
        <ul>
          {leaderboard.map((entry, index) => (
            <li key={index}>
              <span>{entry.userID.username}</span> - {entry.pointsEarned} Crowns
            </li>
          ))}
        </ul>
      </Leaderboard>

      {/* Instructions at the bottom */}
      <InstructionContainer>
        <h3>Instructions</h3>
        <p>{settings.description}</p>
        <p>
          <strong>1.</strong> Visit the website linked above and explore its pages carefully.
        </p>
        <p>
          <strong>2.</strong> Look for the 5 digit code in places like links, description text, or even in the page images.
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
