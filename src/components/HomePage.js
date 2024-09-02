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

  useEffect(() => {
    const initializeUser = async () => {
      const userID = await getUserID(setUserID, setUsername);

      // Retrieve points from localStorage
      const savedPoints = localStorage.getItem(`points_${userID}`);
      if (savedPoints) {
        setPoints(parseFloat(savedPoints));
      }

      // Retrieve energy level and last update time from localStorage
      const savedEnergy = localStorage.getItem(`energy_${userID}`);
      const lastUpdate = localStorage.getItem(`lastUpdate_${userID}`);

      if (savedEnergy !== null && lastUpdate !== null) {
        const savedEnergyFloat = parseFloat(savedEnergy);
        const lastUpdateInt = parseInt(lastUpdate, 10);

        if (!isNaN(savedEnergyFloat) && !isNaN(lastUpdateInt)) {
          const timeElapsed = (Date.now() - lastUpdateInt) / 1000;
          const regeneratedEnergy = Math.min(MAX_ENERGY, savedEnergyFloat + timeElapsed * ENERGY_REGEN_RATE);

          // Set the energy to the regenerated value
          setEnergy(regeneratedEnergy);
        } else {
          setEnergy(savedEnergyFloat || MAX_ENERGY);
        }
      } else {
        setEnergy(MAX_ENERGY);
      }

      // Update the timestamp in localStorage
      localStorage.setItem(`lastUpdate_${userID}`, Date.now().toString());
    };

    initializeUser();
  }, [setUserID, setUsername, setPoints, userID]);

  useEffect(() => {
    if (energy !== null && userID) {
      // Save energy level and current time to localStorage whenever it changes
      localStorage.setItem(`energy_${userID}`, energy.toFixed(2));
      localStorage.setItem(`lastUpdate_${userID}`, Date.now().toString());
    }
  }, [energy, userID]);

  const getMessage = useMemo(() => {
    if (tapCount >= 150) return "He's feeling it! Keep going!";
    if (tapCount >= 100) return "Ouch! That's gotta hurt!";
    if (tapCount >= 50) return "Yeah, slap him more! :)";
    return "Slap this eagle, he took my Golden CHICK!";
  }, [tapCount]);

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

        // Reduce energy on tap
        setEnergy((prevEnergy) => {
          const newEnergy = Math.max(prevEnergy - ENERGY_PER_TAP, 0);
          localStorage.setItem(`energy_${userID}`, newEnergy.toFixed(2));
          localStorage.setItem(`lastUpdate_${userID}`, Date.now().toString());
          return newEnergy;
        });

        if (navigator.onLine) {
          syncPointsWithServer(offlinePoints + pointsToAdd);
        }
      }
    },
    [syncPointsWithServer, setPoints, offlinePoints, energy, userID]
  );

  // Regenerate energy over time
  useEffect(() => {
    const regenInterval = setInterval(() => {
      setEnergy((prevEnergy) => {
        const lastUpdate = parseInt(localStorage.getItem(`lastUpdate_${userID}`), 10);
        const timeElapsed = (Date.now() - lastUpdate) / 1000;
        const regeneratedEnergy = Math.min(MAX_ENERGY, prevEnergy + timeElapsed * ENERGY_REGEN_RATE);

        localStorage.setItem(`energy_${userID}`, regeneratedEnergy.toFixed(2));
        localStorage.setItem(`lastUpdate_${userID}`, Date.now().toString());

        return regeneratedEnergy;
      });
    }, 1000);

    return () => clearInterval(regenInterval);
  }, [userID]);

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
        <Message>{getMessage}</Message>
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
