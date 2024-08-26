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
      // Fetch userID from Telegram and take the first 8 characters
      let tgUserID = window.Telegram.WebApp?.initDataUnsafe?.user?.id;

      if (tgUserID) {
        tgUserID = tgUserID.toString().slice(0, 8); // Use only the first 8 characters
        setUserID(tgUserID);

        try {
          // Try to fetch the user's points from the backend
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${tgUserID}`);
          setPoints(Math.round(response.data.points));  // Round to the nearest integer
        } catch (error) {
          if (error.response && error.response.status === 404) {
            // User not found on the backend, create a new user
            try {
              const newUserResponse = await axios.post(`${process.env.REACT_APP_API_URL}/user-info/`, {
                userID: tgUserID,
                points: 0,
                tasksCompleted: [],
                taskHistory: [],
              });
              setPoints(Math.round(newUserResponse.data.points));  // Round to the nearest integer
            } catch (postError) {
              console.error('Error creating new user:', postError);
            }
          } else {
            console.error('Error fetching user points:', error);
          }
        }
      } else {
        console.error('User ID not available from Telegram.');
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
