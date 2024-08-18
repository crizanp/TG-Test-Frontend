import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import eagleImage from '../assets/eagle.png';
import { usePoints } from '../context/PointsContext';

const HomeContainer = styled.div`
  font-family: Arial, sans-serif;
  color: white;
  background-color: #121212;
  padding: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 86vh;
  text-align: center;
  overflow: hidden;
  user-select: none; /* Prevent text selection */

  @media (max-width: 480px) {
    padding: 5px;
  }
`;

const TopSection = styled.div`
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
`;

const TelegramUsername = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #ff9800;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const PointsDisplay = styled.div`
  background-color: #4caf50;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 16px;
  color: white;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const Message = styled.div`
  padding: 4px 8px;
  font-size: 16px;
  margin-bottom: 25px;
  font-weight: bold;
  color: #ffffff;
  background-color: #ff0000;
  border-radius: 8px;
  text-align: center;
  max-width: 80%;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const MiddleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px; /* Move content closer to the top */
`;

const EagleImage = styled.img`
  width: 320px;
  height: auto;
  cursor: pointer;
  transition: transform 0.4s ease-in-out;
  margin: 10px 0;

  &:hover {
    transform: scale(1.15);
  }
`;

const Description = styled.div`
  font-size: 16px;
  margin-top: 16px;
  line-height: 1.5;
  color: #eeeeee;
  max-width: 85%;
  text-align: center;

  & span {
    color: #ff9800;
    font-weight: bold;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const Footer = styled.div`
  padding: 8px 16px;
  font-size: 12px;
  color: #ffffff;
  background-color: #333333;
  border-radius: 8px;
  text-align: center;
  width: 100%;
  max-width: 380px;
  margin-top: auto;

  a {
    color: #ff9800;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const BottomSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 10px 0;
  background-color: #121212;
`;

const pointFlyingAnimation = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-50px) scale(1.5);
  }
`;

const FlyingPoints = styled.div`
  position: absolute;
  font-size: 14px;
  color: #ff9800;
  animation: ${pointFlyingAnimation} 1s ease-in-out;
  top: ${({ y }) => `${y}px`};
  left: ${({ x }) => `${x}px`};
  pointer-events: none;
  transform: translate(-50%, -100%);
`;

const slapAnimation = keyframes`
  0% {
    transform: scale(1) translateY(0) translateX(0);
    opacity: 1;
  }
  50% {
    transform: scale(1.5) translateY(-10px) translateX(10px);
    opacity: 0.8;
  }
  100% {
    transform: scale(2) translateY(-20px) translateX(-20px);
    opacity: 0;
  }
`;

const SlapEmoji = styled.div`
  position: absolute;
  top: ${({ y }) => y}px;
  left: ${({ x }) => x}px;
  font-size: 24px;
  color: white;
  transform: translate(-50%, -50%);
  animation: ${slapAnimation} 0.6s ease forwards;
`;

function HomePage() {
  const { points, setPoints } = usePoints();
  const [tapCount, setTapCount] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [flyingPoints, setFlyingPoints] = useState([]);
  const [slapEmojis, setSlapEmojis] = useState([]);
  const [slapDirection, setSlapDirection] = useState('left');
  const [slapIntensity, setSlapIntensity] = useState(1);

  const getMessage = () => {
    if (tapCount >= 150) return "He's feeling it! Keep going!";
    if (tapCount >= 100) return "Ouch! That's gotta hurt!";
    if (tapCount >= 50) return "Yeah, slap him more! :)";
    return "Slap this eagle, he took my golden fish!";
  };

  const handleTap = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const height = rect.height;

    let pointsToAdd;
    if (clickY < height / 3) {
      pointsToAdd = 1;
      setSlapIntensity(1.5); // Stronger slap animation
    } else if (clickY < height) {
      pointsToAdd = 0.75;
      setSlapIntensity(1); // Normal slap animation
    } else {
      pointsToAdd = 0.5;
      setSlapIntensity(0.5); // Weaker slap animation
    }

    setAnimate(true);
    setPoints((prevPoints) => prevPoints + pointsToAdd);
    setTapCount((prevTapCount) => prevTapCount + 1);

    setFlyingPoints((prevFlyingPoints) => [
      ...prevFlyingPoints,
      { id: Date.now(), x: e.clientX, y: e.clientY, value: pointsToAdd },
    ]);

    setSlapEmojis((prevEmojis) => [
      ...prevEmojis,
      { id: Date.now(), x: e.clientX, y: e.clientY },
    ]);

    setSlapDirection(slapDirection === 'left' ? 'right' : 'left');
    setTimeout(() => setAnimate(false), 800);

    if (navigator.vibrate) {
      navigator.vibrate(100); // Vibrate for 100ms
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFlyingPoints((prevFlyingPoints) =>
        prevFlyingPoints.filter((point) => Date.now() - point.id < 1000)
      );
      setSlapEmojis((prevEmojis) =>
        prevEmojis.filter((emoji) => Date.now() - emoji.id < 600)
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <HomeContainer>
      <TopSection>
        <TelegramUsername>@demo_username</TelegramUsername>
        <PointsDisplay>Points: {points.toFixed(2)}</PointsDisplay>
      </TopSection>
      <MiddleSection>
        <Message>{getMessage()}</Message>
        <EagleImage
          src={eagleImage}
          alt="Eagle"
          onClick={handleTap}
        />
        <Description>
          Slap the eagle to earn <span>points</span>! Collect more as you <span>play</span>.
          Stay tuned for <span>updates</span> and <span>rewards</span>!
        </Description>
      </MiddleSection>
      <BottomSection>
        <Footer>
          Powered by <a href="https://icogemhunters.com" target="_blank" rel="noopener noreferrer">IGH Group [ ICOGEMHUNTERS ]</a>
        </Footer>
      </BottomSection>

      {flyingPoints.map((point) => (
        <FlyingPoints key={point.id} x={point.x} y={point.y}>
          +{point.value.toFixed(2)}
        </FlyingPoints>
      ))}
      {slapEmojis.map((emoji) => (
        <SlapEmoji key={emoji.id} x={emoji.x} y={emoji.y}>
          👋
        </SlapEmoji>
      ))}
    </HomeContainer>
  );
}

export default HomePage;
