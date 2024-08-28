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
  const [offlinePoints, setOfflinePoints] = useState(0);

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
    return "Slap this eagle, he took my Golden CHICK!";
  };

  const calculatePoints = () => {
    return 3;
  };

  const syncPointsWithServer = async (totalPointsToAdd) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/user-info/update-points/${userID}`, {
        pointsToAdd: totalPointsToAdd,
      });

      setPoints(response.data.points);
      localStorage.setItem(`points_${userID}`, response.data.points);
      setOfflinePoints(0);
    } catch (error) {
      console.error('Error syncing points with server:', error);
    }
  };

  const playVibrationSound = () => {
    const audio = new Audio('/sounds/vibration-sound.mp3'); // Ensure the path to the sound file is correct
    audio.volume = 0.05; // Set a very low volume for a softer sound
    audio.play().catch(error => console.error('Failed to play sound:', error));
  };
  

  const handleTap = throttle(async (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const height = rect.height;
    const width = rect.width;

    if (clickX >= 0 && clickX <= width && clickY >= 0 && clickY <= height) {
      const pointsToAdd = calculatePoints();

      const currentTime = Date.now();
      const timeDiff = currentTime - lastTapTime;
      const tapSpeedMultiplier = Math.max(1, 500 / timeDiff);

      setLastTapTime(currentTime);

      setAnimate(true);
      setPointsAnimation(true);
      setTimeout(() => setPointsAnimation(false), 1000);

      const addedPoints = pointsToAdd * tapSpeedMultiplier;

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

      playVibrationSound(); // Play the vibration sound on each tap

      if (navigator.onLine) {
        syncPointsWithServer(offlinePoints + addedPoints);
      }
    }
  }, 150); // Reduced throttle time to allow more frequent taps

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
        <SlapEmoji key={emoji.id} x={emoji.x} y={emoji.y} style={{ color: 'white' }}>
          👋
        </SlapEmoji>
      ))}
    </HomeContainer>
  );
}

export default HomePage;
