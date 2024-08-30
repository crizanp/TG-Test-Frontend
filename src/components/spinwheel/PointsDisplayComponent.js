import React from "react";
import styled from "styled-components";
import dollarImage from "../../assets/dollar-homepage.png";

const PointsDisplayContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const PointsDisplay = styled.div`
  font-size: 30px;
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DollarIcon = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

const PointsDisplayComponent = ({ points }) => (
  <PointsDisplayContainer>
    <PointsDisplay>
      <DollarIcon src={dollarImage} alt="Dollar Icon" /> {Math.floor(points)}
    </PointsDisplay>
  </PointsDisplayContainer>
);

export default PointsDisplayComponent;
