import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
      // Fetch userID and username from Telegram
      let tgUserID = window.Telegram.WebApp?.initDataUnsafe?.user?.id;
      let tgUsername = window.Telegram.WebApp?.initDataUnsafe?.user?.username;

      if (tgUserID) {
        // Set the full Telegram userID and username
        setUserID(tgUserID);
        setUsername(tgUsername);

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
                username: tgUsername,
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
    <PointsContext.Provider value={{ points, setPoints, userID, username }}>
      {children}
    </PointsContext.Provider>
  );
};
