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
  const [firstName, setFirstName] = useState('');
  const [username, setUsername] = useState('');
  const [referrals, setReferrals] = useState(0);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const { userID, username } = await getUserID(setUserID, setUsername);
        setUserID(userID);
        setUsername(username);

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${userID}`);
        setPoints(Math.round(response.data.user.points));
        setReferrals(response.data.referrals);

        const tgFirstName = window.Telegram.WebApp?.initDataUnsafe?.user?.first_name;
        setFirstName(tgFirstName);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPoints();
  }, []);

  return (
    <PointsContext.Provider value={{ points, setPoints, userID, setUserID, firstName, username, referrals }}>
      {children}
    </PointsContext.Provider>
  );
};
