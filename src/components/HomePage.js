import React, { useState, useEffect } from 'react';
import eagleImage from '../assets/eagle.png';
import dollarImage from '../assets/dollar-homepage.png';
import { usePoints } from '../context/PointsContext';
import UserInfo from './UserInfo';
import axios from 'axios';
import { getUserID } from '../utils/getUserID';
import {
  HomeContainer,
  MiddleSection,
  PointsDisplayContainer,
  DollarIcon,
  Message,
  EagleContainer,
  EagleImage,
  Description,
  FlyingPoints,
  SlapEmoji,
  PointsDisplay,
} from './HomePageStyles';
import { throttle } from 'lodash';

function HomePage() {
  const { points, setPoints, userID, setUserID } = usePoints();
  const [tapCount, setTapCount] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [flyingPoints, setFlyingPoints] = useState([]);
  const [slapEmojis, setSlapEmojis] = useState([]);
  const [lastTapTime, setLastTapTime] = useState(Date.now());
  const [pointsAnimation, setPointsAnimation] = useState(false);
  const [offlinePoints, setOfflinePoints] = useState(0); // State for offline points

  useEffect(() => {
    const initializeUser = async () => {
      await getUserID(setUserID);
      const savedPoints = localStorage.getItem(`points_${userID}`);
      if (savedPoints) {
        setPoints(parseFloat(savedPoints));
      }
    };
    initializeUser();
  }, [setUserID, setPoints, userID]);

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

  const syncPointsWithServer = async (totalPointsToAdd) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/user-info/update-points/${userID}`, {
        pointsToAdd: totalPointsToAdd,
      });

      setPoints(response.data.points);
      localStorage.setItem(`points_${userID}`, response.data.points); // Update local storage with user-specific key
      setOfflinePoints(0); // Reset offline points after sync
    } catch (error) {
      console.error('Error syncing points with server:', error);
    }
  };

  const handleTap = throttle(async (e) => {
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
    setPointsAnimation(true);
    setTimeout(() => setPointsAnimation(false), 1000);

    const addedPoints = pointsToAdd * tapSpeedMultiplier;

    // Update points locally with user-specific key
    setPoints((prevPoints) => {
      const newPoints = prevPoints + addedPoints;
      localStorage.setItem(`points_${userID}`, newPoints);
      return newPoints;
    });

    setTapCount((prevTapCount) => prevTapCount + 1);

    setFlyingPoints((prevFlyingPoints) => [
      ...prevFlyingPoints,
      { id: Date.now(), x: e.clientX, y: e.clientY, value: addedPoints },
    ]);

    setSlapEmojis((prevEmojis) => [
      ...prevEmojis,
      { id: Date.now(), x: e.clientX, y: e.clientY },
    ]);

    setOfflinePoints((prevOfflinePoints) => prevOfflinePoints + addedPoints);

    setTimeout(() => setAnimate(false), 300);

    // Sync points with server if online
    if (navigator.onLine) {
      syncPointsWithServer(offlinePoints + addedPoints);
    }
  }, 300); // Throttle the function, allowing it to be invoked at most once every 300ms

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
      <PointsDisplayContainer>
        <PointsDisplay><DollarIcon src={dollarImage} alt="Dollar Icon" /> {Math.floor(points)}</PointsDisplay>
      </PointsDisplayContainer>
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
