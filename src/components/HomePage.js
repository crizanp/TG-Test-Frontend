import React, { useState, useEffect, useCallback } from 'react';
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
  const { points, setPoints, userID, setUserID, setUsername } = usePoints();
  const [tapCount, setTapCount] = useState(0);
  const [flyingNumbers, setFlyingNumbers] = useState([]);
  const [slapEmojis, setSlapEmojis] = useState([]);
  const [offlinePoints, setOfflinePoints] = useState(0);
  const [energy, setEnergy] = useState(1000);

  const MAX_ENERGY = 1000;
  const ENERGY_REGEN_RATE = 1; // 1 energy per second
  const ENERGY_PER_TAP = 10;

  // Initialize user and load energy from localStorage
  useEffect(() => {
    const initializeUser = async () => {
      const userID = await getUserID(setUserID, setUsername);

      // Retrieve points from localStorage
      const savedPoints = localStorage.getItem(`points_${userID}`);
      if (savedPoints) {
        setPoints(parseFloat(savedPoints));
      }

      // Load energy and calculate regeneration
      const savedEnergy = localStorage.getItem(`energy_${userID}`);
      const lastUpdate = localStorage.getItem(`lastUpdate_${userID}`);
      
      if (savedEnergy !== null && lastUpdate !== null) {
        const savedEnergyFloat = parseFloat(savedEnergy);
        const lastUpdateInt = parseInt(lastUpdate, 10);

        const timeElapsed = (Date.now() - lastUpdateInt) / 1000;
        const regeneratedEnergy = Math.min(
          MAX_ENERGY,
          savedEnergyFloat + timeElapsed * ENERGY_REGEN_RATE
        );

        setEnergy(regeneratedEnergy);
      } else {
        setEnergy(MAX_ENERGY); // Start at max if no saved energy
      }

      localStorage.setItem(`lastUpdate_${userID}`, Date.now().toString());
    };

    initializeUser();
  }, [setUserID, setUsername, setPoints, userID]);

  // Save energy to localStorage on change
  useEffect(() => {
    if (userID) {
      localStorage.setItem(`energy_${userID}`, energy.toFixed(2));
      localStorage.setItem(`lastUpdate_${userID}`, Date.now().toString());
    }
  }, [energy, userID]);

  // Regenerate energy over time
  useEffect(() => {
    const regenInterval = setInterval(() => {
      setEnergy((prevEnergy) => {
        const newEnergy = Math.min(prevEnergy + ENERGY_REGEN_RATE, MAX_ENERGY);
        return newEnergy;
      });
    }, 1000); // 1 energy per second

    return () => clearInterval(regenInterval);
  }, []);

  // Handle tapping
  const handleTap = useCallback(
    (e) => {
      if (energy < ENERGY_PER_TAP) {
        return; // Stop tapping if energy is too low
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;

      if (clickX >= 0 && clickX <= width && clickY >= 0 && clickY <= height) {
        const pointsToAdd = 1; // Each tap adds 1 point

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

        setEnergy((prevEnergy) => {
          const newEnergy = Math.max(prevEnergy - ENERGY_PER_TAP, 0);
          localStorage.setItem(`energy_${userID}`, newEnergy.toFixed(2));
          return newEnergy;
        });
      }
    },
    [energy, setPoints, userID]
  );

  // Sync points with server (debounced)
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

  useEffect(() => {
    if (navigator.onLine && offlinePoints > 0) {
      syncPointsWithServer(offlinePoints);
    }
  }, [offlinePoints, syncPointsWithServer]);

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
        <Message>
          {tapCount >= 150
            ? "He's feeling it! Keep going!"
            : tapCount >= 100
            ? "Ouch! That's gotta hurt!"
            : tapCount >= 50
            ? "Yeah, slap him more! :)"
            : "Slap this eagle, he took my Golden CHICK!"}
        </Message>
        <EagleContainer>
          <EagleImage
            src={eagleImage}
            alt="Eagle"
            onClick={handleTap}
            onTouchStart={(e) => {
              Array.from(e.touches).forEach((touch) =>
                handleTap({ clientX: touch.clientX, clientY: touch.clientY, currentTarget: e.currentTarget })
              );
            }}
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
          +{number.value.toFixed(2)}
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
