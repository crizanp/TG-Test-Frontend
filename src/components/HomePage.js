import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import eagleImage from '../assets/eagle.png';
import { usePoints } from '../context/PointsContext';
import UserInfo from './UserInfo';

const HomeContainer = styled.div`
  font-family: Arial, sans-serif;
  color: white;
  background-color: #121212;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 86vh;
  text-align: center;
  overflow: hidden;
  user-select: none;

  @media (max-width: 480px) {
    padding: 5px;
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
  margin-top: 20px;
`;

const slapAnimation = (direction, intensity) => keyframes`
  0% { transform: translateX(0) rotate(0deg); }
  25% { transform: translateX(${direction === 'left' ? `-${20 * intensity}px` : `${20 * intensity}px`}) rotate(${direction === 'left' ? `-${10 * intensity}deg` : `${10 * intensity}deg`}); }
  50% { transform: translateX(${direction === 'left' ? `-${10 * intensity}px` : `${10 * intensity}px`}) rotate(${direction === 'left' ? `-${5 * intensity}deg` : `${5 * intensity}deg`}); }
  75% { transform: translateX(${direction === 'left' ? `${5 * intensity}px` : `-${5 * intensity}px`}) rotate(${direction === 'left' ? `2deg` : `-2deg`}); }
  100% { transform: translateX(0) rotate(0deg); }
`;

const EagleContainer = styled.div`
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EagleImage = styled.img`
  width: 320px;
  height: auto;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    transform: scale(1.15);
  }

  ${({ animate, direction, intensity }) =>
    animate &&
    css`
      animation: ${slapAnimation(direction, intensity)} 0.8s ease-in-out;
    `}
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

const slapEffectAnimation = keyframes`
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
  animation: ${slapEffectAnimation} 0.6s ease forwards;
`;

function HomePage() {
  const { points, setPoints } = usePoints();
  const [tapCount, setTapCount] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [flyingPoints, setFlyingPoints] = useState([]);
  const [slapEmojis, setSlapEmojis] = useState([]);
  const [slapDirection, setSlapDirection] = useState('left');
  const [slapIntensity, setSlapIntensity] = useState(1);
  const [lastTapTime, setLastTapTime] = useState(Date.now());

  const getMessage = () => {
    if (tapCount >= 150) return "He's feeling it! Keep going!";
    if (tapCount >= 100) return "Ouch! That's gotta hurt!";
    if (tapCount >= 50) return "Yeah, slap him more! :)";
    return "Slap this eagle, he took my golden fish!";
  };

  const calculatePoints = (clickY, height, clickX, width) => {
    // Head/cheek area: Top 30% of the image
    if (clickY < height * 0.3) {
      return 1;
    }
    // Below neck inside the image background
    else if (clickY >= height * 0.3 && clickX >= width * 0.2 && clickX <= width * 0.8) {
      return 0.75;
    }
    // Outside the image background
    else {
      return 0.25;
    }
  };

  const handleTap = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const height = rect.height;
    const width = rect.width;

    const pointsToAdd = calculatePoints(clickY, height, clickX, width);

    const currentTime = Date.now();
    const timeDiff = currentTime - lastTapTime;
    const tapSpeedMultiplier = Math.max(1, 500 / timeDiff);

    setLastTapTime(currentTime);

    setAnimate(true);
    setPoints((prevPoints) => prevPoints + pointsToAdd * tapSpeedMultiplier);
    setTapCount((prevTapCount) => prevTapCount + 1);

    setFlyingPoints((prevFlyingPoints) => [
      ...prevFlyingPoints,
      { id: Date.now(), x: e.clientX, y: e.clientY, value: pointsToAdd * tapSpeedMultiplier },
    ]);

    setSlapEmojis((prevEmojis) => [
      ...prevEmojis,
      { id: Date.now(), x: e.clientX, y: e.clientY },
    ]);

    setSlapDirection(slapDirection === 'left' ? 'right' : 'left');
    setSlapIntensity(Math.min(2, tapSpeedMultiplier));

    setTimeout(() => setAnimate(false), 800);
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
      <UserInfo username="@demo_username" points={points} />
      <MiddleSection>
        <Message>{getMessage()}</Message>
        <EagleContainer>
          <EagleImage
            src={eagleImage}
            alt="Eagle"
            onClick={handleTap}
            animate={animate ? 1 : 0}
            direction={slapDirection}
            intensity={slapIntensity}
          />
        </EagleContainer>
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
