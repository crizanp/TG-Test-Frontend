// src/context/PointsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const PointsContext = createContext();

export const usePoints = () => {
  return useContext(PointsContext);
};

export const PointsProvider = ({ children }) => {
  const [points, setPoints] = useState(0);
  const [userID, setUserID] = useState('');

  useEffect(() => {
    const fetchPoints = async () => {
      const storedUserID = localStorage.getItem('userID');

      if (storedUserID) {
        setUserID(storedUserID);

        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${storedUserID}`);
          setPoints(Math.round(response.data.points));  // Round to the nearest integer
        } catch (error) {
          console.error('Error fetching user points:', error);
        }
      } else {
        const newUserID = Math.floor(10000000 + Math.random() * 90000000).toString();
        localStorage.setItem('userID', newUserID);
        setUserID(newUserID);

        try {
          const newUserResponse = await axios.post(`${process.env.REACT_APP_API_URL}/user-info/`, {
            userID: newUserID,
            points: 0,
            tasksCompleted: [],
            taskHistory: [],
          });
          setPoints(Math.round(newUserResponse.data.points));  // Round to the nearest integer
        } catch (error) {
          console.error('Error creating new user:', error);
        }
      }
    };

    fetchPoints();
  }, []);

  return (
    <PointsContext.Provider value={{ points, setPoints, userID, setUserID }}>
      {children}
    </PointsContext.Provider>
  );
};
