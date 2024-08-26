import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import loadingGif from '../assets/loading.gif';
import backgroundImage from '../assets/background.webp';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  flex-direction: column;
  text-align: center;
  color: #ffffff;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const LoadingImage = styled.img`
  width: 50px; /* Make the loading gif smaller */
  height: 50px;
  margin-bottom: 20px;
`;

const MessageContainer = styled.div`
  margin-top: 20px;
`;

const IGHText = styled.div`
  font-size: 60px; /* Much bigger size for IGH */
  font-weight: bold;
`;

const LaunchText = styled.div`
  font-size: 40px; /* Big size for Launch */
  margin-top: -10px;
`;

const OnText = styled.div`
  font-size: 20px; /* Smaller size for "on" */
  margin-top: -15px;
`;

const TONText = styled.div`
  font-size: 50px; /* Big size for TON */
  margin-top: -10px;
`;

const SubText = styled.div`
  font-size: 18px;
  margin-top: 20px;
  color: #ffffff;
`;

function LoadingPage() {
  const navigate = useNavigate(); // Correct usage of useNavigate hook

  useEffect(() => {
    const checkTelegramUser = () => {
      const tg = window.Telegram.WebApp;

      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        // User is in Telegram, redirect to home
        navigate('/home');
      } else {
        // User is not in Telegram, stay on the loading page
        // You might want to add additional logic here to handle non-Telegram access
      }
    };

    checkTelegramUser();
  }, [navigate]); // Correct usage of useEffect with dependencies

  return (
    <LoadingContainer>
      <LoadingImage src={loadingGif} alt="Loading..." />
      <MessageContainer>
        <IGHText>IGH</IGHText>
        <LaunchText>Launch</LaunchText>
        <OnText>on</OnText>
        <TONText>TON</TONText>
      </MessageContainer>
      <SubText>Loading, please wait...</SubText>
    </LoadingContainer>
  );
}

export default LoadingPage;
