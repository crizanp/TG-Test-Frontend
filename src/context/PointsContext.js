import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getUserID } from '../utils/getUserID';

const PointsContext = createContext();

export const usePoints = () => {
  return useContext(PointsContext);
};

export const PointsProvider = ({ children }) => {
  const [points, setPoints] = useState(0);
  const [userID, setUserID] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const userID = await getUserID(setUserID, setUsername);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user-info/${userID}`);
        setPoints(Math.round(response.data.points));
      } catch (error) {
        if (error.response && error.response.status === 404) {
          try {
            const newUserResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/user-info/register`, {
              userID,
              username,
              points: 0,
              tasksCompleted: [],
              taskHistory: [],
            });
            setPoints(Math.round(newUserResponse.data.points));
          } catch (postError) {
            console.error('Error creating new user:', postError);
          }
        } else {
          console.error('Error fetching user points:', error);
        }
      }
    };

    fetchPoints();
  }, [setUserID, setUsername]);

  return (
    <PointsContext.Provider value={{ points, setPoints, userID, setUserID, username, setUsername }}>
      {children}
    </PointsContext.Provider>
  );
};
