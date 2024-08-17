import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import eagleImage from '../assets/eagle.png';
import { usePoints } from '../context/PointsContext';

const HomeContainer = styled.div`
  font-family: Arial, sans-serif;
  color: white;
  background-color: #121212;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 84vh;
  text-align: center;
  overflow: hidden;
  user-select: none; /* Prevent text selection */


  @media (max-width: 480px) {
    padding: 5px;
  }
`;

const TopSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
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

const slapAnimation = (direction, intensity) => keyframes`
  0% { transform: translateX(0) rotate(0deg); }
  25% { transform: translateX(${direction === 'left' ? `-${20 * intensity}px` : `${20 * intensity}px`}) rotate(${direction === 'left' ? `-${10 * intensity}deg` : `${10 * intensity}deg`}); }
  50% { transform: translateX(${direction === 'left' ? `-${10 * intensity}px` : `${10 * intensity}px`}) rotate(${direction === 'left' ? `-${5 * intensity}deg` : `${5 * intensity}deg`}); }
  75% { transform: translateX(${direction === 'left' ? `${5 * intensity}px` : `-${5 * intensity}px`}) rotate(${direction === 'left' ? `2deg` : `-2deg`}); }
  100% { transform: translateX(0) rotate(0deg); }
`;

const EagleImage = styled.img`
  width: 320px; /* Increase the width to make the eagle larger */
  height: auto;
  cursor: pointer;
  transition: transform 0.4s ease-in-out;
  margin: 10px 0; /* Add some space above and below */

  &:hover {
    transform: scale(1.15); /* Increase scale for hover effect */
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
  margin-top: auto; /* Push the footer to the bottom */

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

function HomePage() {
  const { points, setPoints } = usePoints();
  const [tapCount, setTapCount] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [flyingPoints, setFlyingPoints] = useState([]);
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

    setSlapDirection(slapDirection === 'left' ? 'right' : 'left');
    setTimeout(() => setAnimate(false), 800);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFlyingPoints((prevFlyingPoints) =>
        prevFlyingPoints.filter((point) => Date.now() - point.id < 1000)
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
          animate={animate ? 1 : 0}
          direction={slapDirection}
          intensity={slapIntensity}
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
    </HomeContainer>
  );
}

export default HomePage;
