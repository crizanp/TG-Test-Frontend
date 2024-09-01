import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { usePoints } from '../context/PointsContext';
import styled from 'styled-components';
import { debounce, throttle } from 'lodash';
import UserInfo from './UserInfo';
import { getUserID } from '../utils/getUserID';
// Styled components
const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const MiddleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const PointsDisplayContainer = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  background-color: #fff;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 18px;
  font-weight: bold;
`;

const EagleImage = styled.img`
  width: 150px;
  height: 150px;
  cursor: pointer;
  transition: transform 0.2s;
  &:active {
    transform: scale(0.95);
  }
`;

const FlyingPoints = styled.div`
  position: absolute;
  font-size: 20px;
  color: green;
  animation: fly 1s ease-out forwards;
  
  @keyframes fly {
    to {
      transform: translateY(-100px);
      opacity: 0;
    }
  }
`;

const SlapEmoji = styled.div`
  position: absolute;
  font-size: 30px;
  animation: slap 0.6s ease-out forwards;

  @keyframes slap {
    to {
      transform: translateY(-50px);
      opacity: 0;
    }
  }
`;

const Message = styled.div`
  margin-top: 20px;
  font-size: 16px;
  color: #333;
  text-align: center;
`;

const Description = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #666;
  text-align: center;
  span {
    font-weight: bold;
    color: #333;
  }
`;

function HomePage() {
  const { points, setPoints, userID, setUserID, setUsername } = usePoints();
  const [tapCount, setTapCount] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [flyingPoints, setFlyingPoints] = useState([]);
  const [slapEmojis, setSlapEmojis] = useState([]);
  const [lastTapTime, setLastTapTime] = useState(Date.now());
  const [offlinePoints, setOfflinePoints] = useState(0);

  // Initialize user and fetch points only once
  useEffect(() => {
    const initializeUser = async () => {
      const userID = await getUserID(setUserID, setUsername);
      const savedPoints = localStorage.getItem(`points_${userID}`);
      if (savedPoints) {
        setPoints(parseFloat(savedPoints));
      }
    };
    initializeUser();
  }, [setUserID, setUsername, setPoints, userID]);

  const getMessage = useMemo(() => {
    if (tapCount >= 150) return "He's feeling it! Keep going!";
    if (tapCount >= 100) return "Ouch! That's gotta hurt!";
    if (tapCount >= 50) return "Yeah, slap him more! :)";
    return "Slap this eagle, he took my Golden CHICK!";
  }, [tapCount]);

  const calculatePoints = () => {
    return 3;
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
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;

      if (clickX >= 0 && clickX <= width && clickY >= 0 && clickY <= height) {
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

        setFlyingPoints((prevFlyingPoints) => [
          ...prevFlyingPoints,
          { id: Date.now(), x: e.clientX, y: e.clientY, value: addedPoints },
        ]);

        setSlapEmojis((prevEmojis) => [
          ...prevEmojis,
          { id: Date.now(), x: e.clientX, y: e.clientY },
        ]);

        setOfflinePoints((prevOfflinePoints) => prevOfflinePoints + addedPoints);

        if (navigator.onLine) {
          syncPointsWithServer(offlinePoints + addedPoints);
        }

        setAnimate(true);
        setTimeout(() => setAnimate(false), 300);
      }
    },
    [lastTapTime, syncPointsWithServer, setPoints, offlinePoints, userID]
  );

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
        <div>{Math.floor(points)}</div>
      </PointsDisplayContainer>
      <MiddleSection>
        <Message>{getMessage}</Message>
        <EagleImage
          src="eagle.png"
          alt="Eagle"
          onClick={handleTap}
          $animate={animate ? 1 : 0}
        />
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
