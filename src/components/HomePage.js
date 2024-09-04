import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { usePoints } from '../context/PointsContext';
import { useEnergy } from '../context/EnergyContext';
import {
  HomeContainer,
  PointsDisplayContainer,
  PointsDisplay,
  DollarIcon,
  MiddleSection,
  Message,
  EagleContainer,
  EagleImage,
  Description,
  FlyingNumber,
  SlapEmoji,
  EnergyIconContainer,
  EnergyIcon,
  EnergyCounter,
} from './HomePageStyles';
import { debounce } from 'lodash';
import UserInfo from './UserInfo';
import eagleImage from '../assets/eagle.png';
import dollarImage from '../assets/dollar-homepage.png';
import { getUserID } from '../utils/getUserID';

function HomePage() {
  const { points, setPoints, userID, setUserID } = usePoints();
  const { energy, decreaseEnergy } = useEnergy();
  const [tapCount, setTapCount] = useState(0);
  const [flyingNumbers, setFlyingNumbers] = useState([]);
  const [slapEmojis, setSlapEmojis] = useState([]);
  const [lastTapTime, setLastTapTime] = useState(Date.now());
  const [offlinePoints, setOfflinePoints] = useState(0);

  useEffect(() => {
    const initializeUser = async () => {
      const userID = await getUserID(setUserID);

      // Retrieve points from localStorage
      const savedPoints = localStorage.getItem(`points_${userID}`);
      if (savedPoints) {
        setPoints(parseFloat(savedPoints));
      }
    };
    initializeUser();
  }, [setUserID, setPoints]);

  const getMessage = useMemo(() => {
    if (tapCount >= 150) return "He's feeling it! Keep going!";
    if (tapCount >= 100) return "Ouch! That's gotta hurt!";
    if (tapCount >= 50) return "Yeah, slap him more! :)";
    return "Slap this eagle, he took my Golden CHICK!";
  }, [tapCount]);

  const calculatePoints = () => {
    return 1; // 1 point per tap
  };

  const syncPointsWithServer = useCallback(
    debounce(async (totalPointsToAdd) => {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/user-info/update-points/${userID}`,
          { pointsToAdd: totalPointsToAdd }
        );
        setPoints(response.data.points);
        localStorage.setItem(`points_${userID}`, response.data.points);
        setOfflinePoints(0);
      } catch (error) {
        console.error('Error syncing points with server:', error);
      }
    }, 1000),
    [userID, setPoints]
  );

  const handleTap = useCallback(
    (e) => {
      if (energy <= 0) {
        return; // Stop tapping if energy is depleted
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top - 20; // Adjust the position to start just above the tap

      const pointsToAdd = calculatePoints();

      const currentTime = Date.now();
      const timeDiff = currentTime - lastTapTime;
      const tapSpeedMultiplier = Math.max(1, 500 / timeDiff);

      setLastTapTime(currentTime);

      const addedPoints = pointsToAdd * tapSpeedMultiplier;

      setPoints((prevPoints) => {
        const newPoints = prevPoints + addedPoints;
        localStorage.setItem(`points_${userID}`, newPoints);
        return newPoints;
      });

      setTapCount((prevTapCount) => prevTapCount + 1);

      setFlyingNumbers((prevNumbers) => [
        ...prevNumbers,
        { id: Date.now(), x: e.clientX, y: clickY, value: addedPoints },
      ]);

      setSlapEmojis((prevEmojis) => [
        ...prevEmojis,
        { id: Date.now(), x: e.clientX, y: e.clientY },
      ]);

      setOfflinePoints((prevOfflinePoints) => prevOfflinePoints + addedPoints);

      // Reduce energy by 2 points on each tap
      decreaseEnergy(2);

      if (navigator.onLine) {
        syncPointsWithServer(offlinePoints + addedPoints);
      }
    },
    [lastTapTime, syncPointsWithServer, setPoints, offlinePoints, energy, decreaseEnergy, userID]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setFlyingNumbers((prevNumbers) =>
        prevNumbers.filter((number) => Date.now() - number.id < 1000)
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
        <PointsDisplay>
          <DollarIcon src={dollarImage} alt="Dollar Icon" />
          {Math.floor(points)}
        </PointsDisplay>
      </PointsDisplayContainer>
      <MiddleSection>
        <Message>{getMessage}</Message> {/* Use getMessage directly without parentheses */}
        <EagleContainer>
          <EagleImage
            src={eagleImage}
            alt="Eagle"
            onClick={handleTap}
          />
        </EagleContainer>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <EnergyIconContainer>
            <EnergyIcon energy={energy} />
          </EnergyIconContainer>
          <EnergyCounter>{Math.floor(energy)}/1000</EnergyCounter>
        </div>
        <Description>
          Slap the eagle to earn <span>points</span>! Collect more as you <span>play</span>.
          Stay tuned for <span>updates</span> and <span>rewards</span>!
        </Description>
      </MiddleSection>

      {flyingNumbers.map((number) => (
        <FlyingNumber key={number.id} x={number.x} y={number.y}>
          +{number.value.toFixed(0)}
        </FlyingNumber>
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
