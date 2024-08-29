import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getUserID } from '../utils/getUserID';  // Assuming this is in a separate file

const PointsContext = createContext();

export const usePoints = () => {
  return useContext(PointsContext);
};

export const PointsProvider = ({ children }) => {
  const [points, setPoints] = useState(0);
  const [userID, setUserID] = useState('');
  const [firstName, setFirstName] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        // Get userID and username using getUserID function
        const { userID, username } = await getUserID(setUserID, setUsername);
        setUserID(userID);
        setUsername(username);

        // Fetch points from the backend
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${userID}`);
        setPoints(Math.round(response.data.points));  // Round to the nearest integer

        // Get first name from Telegram WebApp context
        const tgFirstName = window.Telegram.WebApp?.initDataUnsafe?.user?.first_name;
        setFirstName(tgFirstName);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPoints();
  }, []);

  return (
    <PointsContext.Provider value={{ points, setPoints, userID, setUserID, firstName, username }}>
      {children}
    </PointsContext.Provider>
  );
};
