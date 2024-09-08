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
  FlyingNumber,
  SlapEmoji,
  EnergyContainer,
  EarnMoreBox,
  CurvedBorderContainer,
  EnergyCounter,
  EnergyIcon,
  BottomContainer
} from './HomePageStyles';
import { debounce } from 'lodash';
import UserInfo from './UserInfo';
import eagleImage from '../assets/eagle.png';
import dollarImage from '../assets/dollar-homepage.png';
import { getUserID } from '../utils/getUserID';
import { Link } from 'react-router-dom';
import { FaTasks } from 'react-icons/fa';

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
    return 1; 
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
        return; 
      }

      const currentTime = Date.now();
      const tapInterval = currentTime - lastTapTime;

      const isDoubleTap = tapInterval < 300 && tapInterval > 0; 
      setLastTapTime(currentTime); 

      const pointsToAdd = calculatePoints() * (isDoubleTap ? 2 : 1); 

      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;

      if (clickX >= 0 && clickX <= width && clickY >= 0 && clickY <= height) {
        setPoints((prevPoints) => {
          const newPoints = prevPoints + pointsToAdd;
          localStorage.setItem(`points_${userID}`, newPoints);
          return newPoints;
        });

        setTapCount((prevTapCount) => prevTapCount + 1);

        setFlyingNumbers((prevNumbers) => [
          ...prevNumbers,
          { id: Date.now(), x: e.clientX, y: e.clientY, value: pointsToAdd },
        ]);

        setSlapEmojis((prevEmojis) => [
          ...prevEmojis,
          { id: Date.now(), x: e.clientX, y: e.clientY },
        ]);

        setOfflinePoints((prevOfflinePoints) => prevOfflinePoints + pointsToAdd);

        decreaseEnergy(2 * (isDoubleTap ? 2 : 1)); 

        if (navigator.onLine) {
          syncPointsWithServer(offlinePoints + pointsToAdd);
        }
      }
    },
    [syncPointsWithServer, setPoints, offlinePoints, energy, decreaseEnergy, userID, lastTapTime]
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
      <CurvedBorderContainer />

      <PointsDisplayContainer>
        <PointsDisplay>
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
          />
        </EagleContainer>

        <BottomContainer>
          {/* Left Box for "Earn More" */}
          {/* <EarnMoreBox>
            <Link to="/tasks" style={{ textDecoration: 'none', color: 'white' }}>
              <FaTasks size={18} />
              <span>Earn More</span>
            </Link>
          </EarnMoreBox> */}

          {/* Right Box for Energy */}
          <EnergyContainer>
            <EnergyIcon energy={energy} />
            <EnergyCounter>{Math.floor(energy)}/1000</EnergyCounter>
          </EnergyContainer>
        </BottomContainer>
      </MiddleSection>

      {flyingNumbers.map((number) => (
        <FlyingNumber key={number.id} x={number.x} y={number.y}>
          +{number.value}
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
