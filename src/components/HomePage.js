import React, { useState, useEffect } from 'react';
import eagleImage from '../assets/eagle.png';
import { usePoints } from '../context/PointsContext';
import UserInfo from './UserInfo';
import axios from 'axios';
import { getUserID } from '../utils/getUserID';
import {
  HomeContainer,
  MiddleSection,
  Message,
  EagleContainer,
  EagleImage,
  Description,
  FlyingPoints,
  SlapEmoji,
} from './HomePageStyles';

function HomePage() {
  const { points, setPoints, userID, setUserID } = usePoints();
  const [tapCount, setTapCount] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [flyingPoints, setFlyingPoints] = useState([]);
  const [slapEmojis, setSlapEmojis] = useState([]);
  const [lastTapTime, setLastTapTime] = useState(Date.now());

  useEffect(() => {
    const initializeUser = async () => {
      await getUserID(setUserID);
    };
    initializeUser();
  }, [setUserID]);

  const getMessage = () => {
    if (tapCount >= 150) return "He's feeling it! Keep going!";
    if (tapCount >= 100) return "Ouch! That's gotta hurt!";
    if (tapCount >= 50) return "Yeah, slap him more! :)";
    return "Slap this eagle, he took my golden cheek!";
  };

  const calculatePoints = (clickY, height, clickX, width) => {
    if (clickY < height * 0.3) {
      return 1;
    } else if (clickY >= height * 0.3 && clickX >= width * 0.2 && clickX <= width * 0.8) {
      return 0.75;
    } else {
      return 0.25;
    }
  };

  const handleTap = async (e) => {
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
    const addedPoints = pointsToAdd * tapSpeedMultiplier;

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/user-info/update-points/${userID}`, {
        pointsToAdd: addedPoints,
      });

      setPoints(response.data.points); // Update points dynamically
    } catch (error) {
      console.error('Error updating points:', error);
      alert('Failed to update points. Please try again.');
    }

    setTapCount((prevTapCount) => prevTapCount + 1);

    setFlyingPoints((prevFlyingPoints) => [
      ...prevFlyingPoints,
      { id: Date.now(), x: e.clientX, y: e.clientY, value: addedPoints },
    ]);

    setSlapEmojis((prevEmojis) => [
      ...prevEmojis,
      { id: Date.now(), x: e.clientX, y: e.clientY },
    ]);

    setTimeout(() => setAnimate(false), 300);
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
      <UserInfo />
      <MiddleSection>
        <Message>{getMessage()}</Message>
        <EagleContainer>
          <EagleImage
            src={eagleImage}
            alt="Eagle"
            onClick={handleTap}
            $animate={animate ? 1 : 0}
          />
        </EagleContainer>
        <Description>
          Slap the eagle to earn <span>points</span>! Collect more as you <span>play</span>.
          Stay tuned for <span>updates</span> and <span>rewards</span>!
        </Description>
      </MiddleSection>

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
