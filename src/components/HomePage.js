import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { usePoints } from '../context/PointsContext';
import { useEnergy } from '../context/EnergyContext'; 
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';
import { FaTasks, FaRegGem } from 'react-icons/fa';  // Import FaRegGem for gem icon
import styled ,{  createGlobalStyle }from 'styled-components';

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
  CurvedBorderContainer,
  EnergyCounter,
  EnergyIcon,
  BottomContainer,
} from './HomePageStyles';
import UserInfo from './UserInfo';
import dollarImage from '../assets/dollar-homepage.png';
import { getUserID } from '../utils/getUserID';
import eagleImage from '../assets/eagle.png';
// Styled Gem Icon
const GemIcon = styled(FaRegGem)`
  color: #36a8e5;  // Similar color to UserInfo component
  margin-left: 8px;
  margin-right: 8px;
  font-size: 1.9rem;
`;
const GlobalStyle = createGlobalStyle`
  * {
    -webkit-user-select: none; 
    -webkit-touch-callout: none; 
    outline: none; 
    -webkit-tap-highlight-color: transparent; 
  }
`;
function HomePage() {
  const { points, setPoints, userID, setUserID } = usePoints();
  const { energy, decreaseEnergy } = useEnergy();
  const [tapCount, setTapCount] = useState(0);
  const [flyingNumbers, setFlyingNumbers] = useState([]);
  const [slapEmojis, setSlapEmojis] = useState([]);
  const [offlinePoints, setOfflinePoints] = useState(0);

  const curvedBorderRef = useRef(null);
  const bottomMenuRef = useRef(null);

  // Accumulate unsynced points to avoid sending too many server requests
  const [unsyncedPoints, setUnsyncedPoints] = useState(0);
  const handlePreventContextMenu = (event) => {
    event.preventDefault(); // Prevent context menu from appearing
  };
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
        setUnsyncedPoints(0); // Reset unsynced points after successful sync
      } catch (error) {
        console.error('Error syncing points with server:', error);
      }
    }, 2000), // Sync points every 2 seconds to reduce server load
    [userID, setPoints]
  );

  const handleTap = useCallback(
    (e) => {
      if (energy <= 0) {
        return; 
      }

      if (curvedBorderRef.current && bottomMenuRef.current) {
        const curvedBorderRect = curvedBorderRef.current.getBoundingClientRect();
        const bottomMenuRect = bottomMenuRef.current.getBoundingClientRect();

        const isDoubleTap = e.touches && e.touches.length === 2;
        const pointsToAdd = calculatePoints() * (isDoubleTap ? 2 : 1);

        const clickX = e.touches[0].clientX;
        const clickY = e.touches[0].clientY;

        if (clickY > curvedBorderRect.bottom && clickY < bottomMenuRect.top) {
          const eagleElement = document.querySelector('.eagle-image');
          eagleElement.classList.add('shift-up');
          setTimeout(() => {
            eagleElement.classList.remove('shift-up');
          }, 300);

          setPoints((prevPoints) => {
            const newPoints = prevPoints + pointsToAdd;
            localStorage.setItem(`points_${userID}`, newPoints);
            return newPoints;
          });

          setTapCount((prevTapCount) => prevTapCount + 1);

          const animateFlyingPoints = () => {
            const id = Date.now();
            setFlyingNumbers((prevNumbers) => [
              ...prevNumbers,
              { id, x: clickX, y: clickY - 30, value: pointsToAdd }
            ]);

            setTimeout(() => {
              setFlyingNumbers((prevNumbers) => prevNumbers.filter((num) => num.id !== id));
            }, 750);
          };

          animateFlyingPoints();

          setSlapEmojis((prevEmojis) => [
            ...prevEmojis,
            { id: Date.now(), x: clickX, y: clickY },
          ]);

          setOfflinePoints((prevOfflinePoints) => prevOfflinePoints + pointsToAdd);
          setUnsyncedPoints((prevUnsyncedPoints) => prevUnsyncedPoints + pointsToAdd);

          decreaseEnergy(isDoubleTap ? 2 : 1);

          // Only sync points every 2 seconds to reduce server load
          if (navigator.onLine) {
            syncPointsWithServer(unsyncedPoints + pointsToAdd);
          }
        }
      }
    },
    [syncPointsWithServer, setPoints, unsyncedPoints, offlinePoints, energy, decreaseEnergy, userID]
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

  // Sync points before the user unloads the page to minimize unsynced points
  useEffect(() => {
    const syncBeforeUnload = (e) => {
      if (navigator.onLine && unsyncedPoints > 0) {
        syncPointsWithServer(unsyncedPoints);
      }
    };
    window.addEventListener('beforeunload', syncBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', syncBeforeUnload);
    };
  }, [unsyncedPoints, syncPointsWithServer]);

  return (
    <>
            <GlobalStyle />

    
    <HomeContainer onTouchStart={handleTap}>
      <UserInfo />
      <CurvedBorderContainer ref={curvedBorderRef} className="curved-border" />
      <PointsDisplayContainer>
      <PointsDisplay>
          <GemIcon /> {/* Display the gem icon here */}
          {Math.floor(points)}  {/* Display points as gems */}
        </PointsDisplay>
      </PointsDisplayContainer>
      <MiddleSection>
        <Message>{getMessage}</Message>
        <EagleContainer>
        <EagleImage
          src={eagleImage}
          alt="Eagle"
          className="eagle-image"
          onContextMenu={handlePreventContextMenu} // Disable right-click or long-press menu
        />
        </EagleContainer>
      </MiddleSection>

      <BottomContainer ref={bottomMenuRef} className="bottom-menu">
        <EnergyContainer>
          <EnergyIcon energy={energy} />
          <EnergyCounter>{Math.floor(energy)}/3000</EnergyCounter>
        </EnergyContainer>
        <Link to="/leaderboard" style={{ textDecoration: 'none' }}>
          <EnergyContainer>
            <FaTasks style={{ marginRight: '5px' }} />
            Leaderboard
          </EnergyContainer>
        </Link>
      </BottomContainer>

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
    </>
  );
}

export default HomePage;
