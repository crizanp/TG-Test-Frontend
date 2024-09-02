import React, { useCallback, useState, useEffect } from 'react';
import { useEnergy } from '../context/EnergyContext';
import { usePoints } from '../context/PointsContext';
import eagleImage from '../assets/eagle.png'; // Ensure this image is in your assets folder
import dollarImage from '../assets/dollar-homepage.png'; // Import the dollar image

// Styling components (you can adapt these to your styling solution)
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
} from './HomePageStyles'; // You will need to implement this styled component file or use another styling method.

function HomePage() {
  const { energy, decreaseEnergy } = useEnergy();
  const { points, setPoints } = usePoints();
  
  const [tapCount, setTapCount] = useState(0);
  const [flyingNumbers, setFlyingNumbers] = useState([]);
  const [slapEmojis, setSlapEmojis] = useState([]);

  const handleTap = useCallback((e) => {
    if (energy > 0) {
      decreaseEnergy(10); // Decrease energy by 10 per tap

      const pointsToAdd = 1; // Each tap adds 1 point

      setPoints((prevPoints) => prevPoints + pointsToAdd);
      setTapCount((prevTapCount) => prevTapCount + 1);

      // For displaying flying numbers and slap emojis
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      setFlyingNumbers((prevNumbers) => [
        ...prevNumbers,
        { id: Date.now(), x: clickX, y: clickY, value: pointsToAdd },
      ]);

      setSlapEmojis((prevEmojis) => [
        ...prevEmojis,
        { id: Date.now(), x: clickX, y: clickY },
      ]);
    } else {
      console.log("Not enough energy!");
    }
  }, [energy, decreaseEnergy, setPoints]);

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

  const getMessage = useCallback(() => {
    if (tapCount >= 150) return "He's feeling it! Keep going!";
    if (tapCount >= 100) return "Ouch! That's gotta hurt!";
    if (tapCount >= 50) return "Yeah, slap him more! :)";
    return "Slap this eagle, he took my Golden CHICK!";
  }, [tapCount]);

  return (
    <HomeContainer>
      <PointsDisplayContainer>
        <PointsDisplay>
          <DollarIcon src={dollarImage} alt="Dollar Icon" />
          {Math.floor(points)}
        </PointsDisplay>
      </PointsDisplayContainer>
      <MiddleSection>
        <Message>{getMessage()}</Message>
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
