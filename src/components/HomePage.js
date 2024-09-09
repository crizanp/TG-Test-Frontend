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
  
      const isDoubleTap = e.touches && e.touches.length === 2;
      const pointsToAdd = calculatePoints() * (isDoubleTap ? 2 : 1); 
  
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.touches[0].clientX - rect.left;
      const clickY = e.touches[0].clientY - rect.top;
      const width = rect.width;
      const height = rect.height;
  
      if (clickX >= 0 && clickX <= width && clickY >= 0 && clickY <= height) {
        setPoints((prevPoints) => {
          const newPoints = prevPoints + pointsToAdd;
          localStorage.setItem(`points_${userID}`, newPoints);
          return newPoints;
        });
  
        setTapCount((prevTapCount) => prevTapCount + 1);
  
        // Function to animate the flying points with a gap and remove them after animation
        const animateFlyingPoints = (delay, index) => {
          const id = Date.now() + delay;
          const offsetX = (index % 2 === 0 ? 1 : -1) * (10 + index * 5); // Alternate left and right with increasing gap
          const offsetY = -index * 20; // Move each "+1" up by 20px more than the previous one
  
          setFlyingNumbers((prevNumbers) => [
            ...prevNumbers,
            { id, x: e.touches[0].clientX + offsetX, y: e.touches[0].clientY + offsetY, value: pointsToAdd }
          ]);
  
          // Remove the flying number after 1 second (1000ms)
          setTimeout(() => {
            setFlyingNumbers((prevNumbers) => prevNumbers.filter((num) => num.id !== id));
          }, 1000); // Adjust time as per your animation length
        };
  
        // Display the flying points with a staggered delay (e.g., every 100ms)
        for (let i = 0; i < 4; i++) {
          animateFlyingPoints(i * 100, i); // Delays of 0ms, 100ms, 200ms, and 300ms, with increasing offsets
        }
  
        setSlapEmojis((prevEmojis) => [
          ...prevEmojis,
          { id: Date.now(), x: e.touches[0].clientX, y: e.touches[0].clientY },
        ]);
  
        setOfflinePoints((prevOfflinePoints) => prevOfflinePoints + pointsToAdd);
  
        decreaseEnergy(2 * (isDoubleTap ? 2 : 1)); 
  
        if (navigator.onLine) {
          syncPointsWithServer(offlinePoints + pointsToAdd);
        }
      }
    },
    [syncPointsWithServer, setPoints, offlinePoints, energy, decreaseEnergy, userID]
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
            onTouchStart={handleTap} 
          />
        </EagleContainer>

        <BottomContainer>
          <EnergyContainer>
            <EnergyIcon energy={energy} />
            <EnergyCounter>{Math.floor(energy)}/3000</EnergyCounter>
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
