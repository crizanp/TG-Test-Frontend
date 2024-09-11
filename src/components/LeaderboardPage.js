import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled, { css } from 'styled-components';
import { FaUserCircle } from 'react-icons/fa';

const LeaderboardContainer = styled.div`
  background-color: #1e1e1e;
  color: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
  font-family: "Orbitron", sans-serif;
  overflow-x: hidden;
`;

const Title = styled.h1`
  color: #ffcc00;
  margin-bottom: 20px;
  font-size: 28px;
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const Table = styled.table`
  width: 100%;
  max-width: 900px;
  border-collapse: collapse;
  margin-top: 20px;

  @media (max-width: 768px) {
    width: 100%;
    display: block;
    overflow-x: auto;
  }
`;

const TableHeader = styled.th`
  background-color: #2a2a2a;
  color: #ffcc00;
  padding: 12px;
  border-bottom: 2px solid #ffcc00;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: left;

  @media (max-width: 768px) {
    padding: 8px;
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

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
  }
`;

const TableCell = styled.td`
  padding: 15px;
  color: #ffffff;
  font-size: 18px;
  border-bottom: 1px solid #3e3e3e;
  text-align: left;

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
`;

const RankCell = styled.td`
  width: 10%;
  padding: 10px;
  color: #ffcc00;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  position: relative;

  /* Custom Pentagon Shape and Border for top 3 ranks */
  ${({ rank }) =>
    rank === 1 &&
    css`
      background: #b9f2ff;
      clip-path: polygon(52% 11%, 83% 34%, 74% 74%, 30% 74%, 16% 37%);
      color: #1e1e1e;
      border: 2px solid #00f;
      box-sizing: border-box;
      box-shadow: 0px 0px 10px rgba(0, 255, 255, 0.5);
      width: 50px;  /* Reduced size */
      height: 50px; /* Smaller height */
    `}

  ${({ rank }) =>
    rank === 2 &&
    css`
      background: #ffd700;
      clip-path: polygon(52% 11%, 83% 34%, 74% 74%, 30% 74%, 16% 37%);
      color: #1e1e1e;
      border: 2px solid #ff8800;
      box-sizing: border-box;
      box-shadow: 0px 0px 10px rgba(255, 215, 0, 0.5);
      width: 50px;  /* Reduced size */
      height: 50px; /* Smaller height */
    `}

  ${({ rank }) =>
    rank === 3 &&
    css`
      background: #c0c0c0;
      clip-path: polygon(52% 11%, 83% 34%, 74% 74%, 30% 74%, 16% 37%);
      color: #1e1e1e;
      border: 2px solid #888;
      box-sizing: border-box;
      box-shadow: 0px 0px 10px rgba(192, 192, 192, 0.5);
      width: 50px;  /* Reduced size */
      height: 50px; /* Smaller height */
    `}

  ${({ rank }) =>
    rank > 3 &&
    css`
      color: #ffcc00;
      font-size: 18px;
      text-align: left;
      width: auto;
    `}

  @media (max-width: 768px) {
    font-size: 16px;
    width: auto;
  }
`;

const UserCell = styled.td`
  display: flex;
  align-items: center;
  padding: 15px;
  color: #ffffff;
  font-size: 18px;
  text-align: left;
  border-bottom: 1px solid #3e3e3e;
  width: 45%;

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 10px;
    width: auto;
  }
`;

const PointsCell = styled.td`
  padding: 15px;
  color: #00ff66;
  font-weight: bold;
  font-size: 18px;
  min-width: 40%;
  border-bottom: 1px solid #3e3e3e;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 8px;
    text-align: left;
  }
`;

const UserIcon = styled(FaUserCircle)`
  width: 30px;
  height: 30px;
  margin-right: 8px;
  color: #ffcc00;

  @media (max-width: 768px) {
    width: 25px;
    height: 25px;
  }
`;

const UserID = styled.span`
  color: #cccccc;
  font-size: 18px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const NoUsersMessage = styled.div`
  color: #ffcc00;
  margin-top: 20px;
  font-size: 18px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

function LeaderboardPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/fetchdata`);
        const sortedUsers = response.data.sort((a, b) => b.points - a.points).slice(0, 20); // Top 20 users
        setUsers(sortedUsers);
      } catch (error) {
        console.error('Error fetching top users:', error);
      }
    };

    fetchTopUsers();
  }, []);

  const truncateUserID = (userID) => {
    return `${userID.slice(0, 3)}...${userID.slice(-3)}`;
  };

  return (
    <LeaderboardContainer>
      <Title>Top 20 Users</Title>
      {users.length === 0 ? (
        <NoUsersMessage>No users found</NoUsersMessage>
      ) : (
        <Table>
          <thead>
            <tr>
              <TableHeader>#</TableHeader>
              <TableHeader>User</TableHeader>
              <TableHeader>Total</TableHeader>
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
                <PointsCell>{user.points.toFixed(0)}</PointsCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}
    </LeaderboardContainer>
  );
}

export default LeaderboardPage;
