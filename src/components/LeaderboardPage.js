import React, { useEffect, useState } from "react";
import axios from "axios";
import styled, { css } from "styled-components";
import { FaUserCircle, FaGamepad, FaTasks, FaUserFriends, FaCoins, FaCrown } from "react-icons/fa";
import { Link } from 'react-router-dom'; // Import Link for navigation
import SkeletonLoader from "./SkeletonLoader"; // Import the SkeletonLoader component

const telegramColor = '#0088cc'; // Telegram color (blue)

const LeaderboardContainer = styled.div`
  background-color: #1e1e1e;
  color: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: "Orbitron", sans-serif;
  overflow-x: hidden;
  padding-bottom: 60px;
`;

const PointsDisplayContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const PointsDisplay = styled.div``;

const Title = styled.h1`
  color: #e8e7e4;
  margin-bottom: 20px;
  font-size: 36px;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 28px;
  }

  @media (max-width: 320px) {
    font-size: 22px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  table-layout: auto;

  @media (max-width: 768px) {
    display: table;
    overflow-x: auto;
  }
`;

const TableHeader = styled.th`
  background-color: #2a2a2a;
  color: #e8e7e4;
  padding: 12px;
  border-bottom: 2px solid #e8e7e4;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: left;

  @media (max-width: 768px) {
    padding: 8px;
  }

  @media (max-width: 320px) {
    font-size: 14px;
    padding: 6px;
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #2e2e2e;
  }
  &:hover {
    background-color: #333333;
    transition: background-color 0.3s ease-in-out;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  color: #ffffff;
  font-size: 18px;
  text-align: left;

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 16px;
  }

  @media (max-width: 320px) {
    font-size: 14px;
    padding: 6px;
  }
`;

const RankCell = styled.td`
  width: 20%;
  padding: 10px;
  color: #e8e7e4;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  position: relative;

  ${({ rank }) =>
    rank === 1 &&
    css`
      background: #b9f2ff;
      clip-path: polygon(49% 19%, 65% 35%, 60% 65%, 40% 66%, 33% 36%);
      color: #1e1e1e;
      box-shadow: 0px 0px 10px rgba(0, 255, 255, 0.5);
      height: 40px;
    `}

  ${({ rank }) =>
    rank === 2 &&
    css`
      background: #ffd700;
      clip-path: polygon(49% 19%, 65% 35%, 60% 65%, 40% 66%, 33% 36%);
      color: #1e1e1e;
      box-shadow: 0px 0px 10px rgba(255, 215, 0, 0.5);
      height: 40px;
    `}

  ${({ rank }) =>
    rank === 3 &&
    css`
      background: #c0c0c0;
      clip-path: polygon(49% 19%, 65% 35%, 60% 65%, 40% 66%, 33% 36%);
      color: #1e1e1e;
      box-shadow: 0px 0px 10px rgba(192, 192, 192, 0.5);
      height: 40px;
    `}

  ${({ rank }) =>
    rank > 3 &&
    css`
      color: #e8e7e4;
      font-size: 18px;
      text-align: center;
    `}

  @media (max-width: 320px) {
    font-size: 14px;
    height: 30px;
  }
`;

const UserCell = styled.td`
  width: 100%;
  display: flex;
  align-items: center; /* Center align vertically */
  padding: 12px;
  color: #ffffff;
  font-size: 18px;
  text-align: left;
  flex-direction: row;
  justify-content: left;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 320px) {
    font-size: 14px;
    padding: 6px;
  }
`;

const PointsCell = styled.td`
  width: 30%;
  padding: 12px;
  color: #d5dbd7;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
  vertical-align: middle; /* Align content vertically */
  
  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 320px) {
    font-size: 14px;
    padding: 6px;
  }

  /* Crown icon and points alignment */
  span {
    display: inline-block;
    vertical-align: middle; /* Align crown and points text to the middle */
    line-height: normal;
  }
`;


const UserIcon = styled(FaUserCircle)`
  width: 30px;
  height: 30px;
  margin-right: 8px;
  color: #e8e7e4;

  @media (max-width: 320px) {
    width: 20px;
    height: 20px;
  }
`;

const UserID = styled.span`
  color: #cccccc;
  font-size: 18px;

  @media (max-width: 320px) {
    font-size: 14px;
  }
`;

const NoUsersMessage = styled.div`
  color: #e8e7e4;
  margin-top: 20px;
  font-size: 18px;

  @media (max-width: 320px) {
    font-size: 14px;
  }
`;

const EarnMoreContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  padding-top: 40px;
  background-color: #292929;

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-around;
  }

  @media (max-width: 320px) {
    flex-direction: column;
    justify-content: center;
  }
`;

const EarnBox = styled(Link)` /* Change div to Link for routing */
  background-color: #1e1e1e;
  border: 2px solid ${telegramColor}; /* Use Telegram color for border */
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  width: 150px;
  color: #e8e7e4;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
  height: 85px; /* Set a fixed height to ensure all boxes are the same */
  flex-grow: 1;
  text-decoration: none; /* Remove underline from Link */

  &:hover {
    background-color: #333333; /* Add a hover effect */
  }

  @media (max-width: 768px) {
    width: 30%;
    margin-bottom: 10px;
    height: 85px; /* Maintain same height across screen sizes */
  }

  @media (max-width: 320px) {
    width: 80%;
    margin-bottom: 10px;
    height: 85px; /* Maintain same height on small screens */
  }
`;

const EarnBoxIcon = styled.div`
  font-size: 24px;
  margin-bottom: 5px;
  color: white;
`;

const EarnBoxTitle = styled.h2`
  font-size: 14px;
  text-transform: uppercase;
`;

function LeaderboardPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Loading state
  
    useEffect(() => {
      const fetchTopUsers = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/user-info/fetchdata`
          );
          const sortedUsers = response.data
            .sort((a, b) => b.points - a.points)
            .slice(0, 20); // Top 20 users
          setUsers(sortedUsers);
        } catch (error) {
          console.error("Error fetching top users:", error);
        } finally {
          setIsLoading(false); // Set loading to false after data is fetched
        }
      };
  
      fetchTopUsers();
    }, []);
  
    const truncateUserID = (userID) => {
      return `${userID.slice(0, 3)}...${userID.slice(-3)}`;
    };
  
    return (
      <LeaderboardContainer>
        <EarnMoreContainer>
        <EarnBox to="/home">
          <EarnBoxIcon>
            <FaGamepad />
          </EarnBoxIcon>
          <EarnBoxTitle>Play Game</EarnBoxTitle>
        </EarnBox>

        <EarnBox to="/earn">
          <EarnBoxIcon>
            <FaTasks />
          </EarnBoxIcon>
          <EarnBoxTitle>Complete Task</EarnBoxTitle>
        </EarnBox>

        <EarnBox to="/friend">
          <EarnBoxIcon>
            <FaUserFriends />
          </EarnBoxIcon>
          <EarnBoxTitle>Refer Friends</EarnBoxTitle>
        </EarnBox>
        </EarnMoreContainer>
  
        <PointsDisplayContainer id="pointsDisplay">
          <PointsDisplay>
          <PointsDisplay>
          <img
            src="https://cdn3d.iconscout.com/3d/premium/thumb/champion-trophys-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--winner-podium-display-leaderboard-business-pack-illustrations-6516638.png?f=webp"
            alt="Leaderboard Logo"
            style={{
              width: "250px",
              height: "150px",
              marginTop: "20px",
            }}
          />
        </PointsDisplay>
          </PointsDisplay>
        </PointsDisplayContainer>
  
        <Title>Top Leaderboard</Title>
  
        {/* Conditionally show the SkeletonLoader if data is still loading */}
        {isLoading ? (
          <SkeletonLoader /> // Show skeleton loader
        ) : users.length === 0 ? (
          <NoUsersMessage>No users found</NoUsersMessage>
        ) : (
          <Table>
            <thead>
              <tr>
                <TableHeader style={{ textAlign: "center" }}>#</TableHeader>
                <TableHeader>User</TableHeader>
                <TableHeader style={{ textAlign: "center" }}>Total</TableHeader>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <TableRow key={user.userID}>
                  <RankCell rank={index + 1}>{index + 1}</RankCell>
                  <UserCell>
                    <UserIcon />
                    <UserID>{truncateUserID(user.userID)}</UserID>
                  </UserCell>
                  <PointsCell>
                    <FaCrown style={{ marginRight: "8px", color: "#ffd700" }} />
                    {user.points.toFixed(0)}
                  </PointsCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </LeaderboardContainer>
    );
  }
  
  export default LeaderboardPage;

