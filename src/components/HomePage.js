import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { usePoints } from '../context/PointsContext';
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
  FlyingEagle,
  SlapEmoji,
} from './HomePageStyles'; // Import your styled components
import { debounce, throttle } from 'lodash';
import UserInfo from './UserInfo';
import eagleImage from '../assets/eagle.png'; // Your existing eagle image
import dollarImage from '../assets/dollar-homepage.png'; // Your existing dollar icon image
import { getUserID } from '../utils/getUserID';
const flyingEagleImage = "https://i.postimg.cc/tT2fFdfj/IGH-Tap-Mini-Apps-3.png";

function HomePage() {
  const { points, setPoints, userID, setUserID, setUsername } = usePoints();
  const [tapCount, setTapCount] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [flyingEagles, setFlyingEagles] = useState([]);
  const [slapEmojis, setSlapEmojis] = useState([]);
  const [lastTapTime, setLastTapTime] = useState(Date.now());
  const [offlinePoints, setOfflinePoints] = useState(0);

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

        setFlyingEagles((prevEagles) => [
          ...prevEagles,
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
      setFlyingEagles((prevEagles) =>
        prevEagles.filter((eagle) => Date.now() - eagle.id < 2000)
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
        <PointsDisplay $animate={animate}>
          <DollarIcon src={dollarImage} alt="Dollar Icon" />
          {Math.floor(points)}
        </PointsDisplay>
      </PointsDisplayContainer>
      <MiddleSection>
        <Message>{getMessage}</Message>
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

      {flyingEagles.map((eagle) => (
        <FlyingEagle key={eagle.id} x={eagle.x} y={eagle.y}>
          <img src={flyingEagleImage} alt="Flying Eagle" />
        </FlyingEagle>
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
