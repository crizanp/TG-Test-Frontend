import styled from "styled-components";

const HeroDiv = styled.div`
  display: flex;
  margin: auto;
  position: relative;
`;

const WheelContainer = styled.div`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  border: 4px solid black;

  &::before {
    content: "";
    position: absolute;
    border: 4px solid rgba(255, 255, 255, 0.1);
    width: 280px;
    height: 280px;
    border-radius: 50%;
    z-index: 100;
  }

  @media (max-width: 992px) {
    width: 280px;
    height: 280px;

    &::before {
      width: 260px;
      height: 260px;
    }
  }

  @media (max-width: 576px) {
    width: 240px;
    height: 240px;

    &::before {
      width: 220px;
      height: 220px;
    }
  }
`;

const InnerWheel = styled.div`
  width: 100%;
  height: 100%;
  transition: all 4s ease-out;
  position: absolute;
`;

const Section = styled.div`
  overflow: hidden;
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 50%;
  transform-origin: 0% 100%;
  background: ${({ color }) => color};
  transform: ${({ rotation }) => `rotate(${rotation}deg) skewY(-30deg)`};

  .fa {
    position: absolute;
    z-index: 10000;
    font-size: 18px;
    font-weight: 900;
    text-align: center;
    width: 100%;
    height: 100%;
    top: 41%; 
    left: 5%;
    transform: skewY(30deg) rotate(-60deg);
    color: white;

    @media (max-width: 576px) {
      font-size: 14px;
    }
  }
`;

export { HeroDiv, WheelContainer, InnerWheel, Section };
