import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const PointsContext = createContext();

export const usePoints = () => {
  return useContext(PointsContext);
};

export const PointsProvider = ({ children }) => {
  const [points, setPoints] = useState(0);
  const [userID, setUserID] = useState('');
  const [referrals, setReferrals] = useState(0); // New state for storing total referrals

  useEffect(() => {
    const fetchPoints = async () => {
      let tgUserID = window.Telegram.WebApp?.initDataUnsafe?.user?.id;

      if (tgUserID) {
        tgUserID = tgUserID.toString().slice(0, 8); // Slice to 8 characters
        setUserID(tgUserID);

        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${tgUserID}`);
          setPoints(Math.round(response.data.points));
          setReferrals(response.data.referrals || 0); // Set referrals count

          // Check if there's a referrer ID in the URL and update it
          const urlParams = new URLSearchParams(window.location.search);
          const referrerID = urlParams.get('start');

          if (referrerID && !response.data.referrer) {
            await axios.post(`${process.env.REACT_APP_API_URL}/user-info/`, {
              userID: tgUserID,
              referrerID: referrerID.slice(0, 8), // Slice to 8 characters
              points: 0, // Assuming new users start with 0 points
              tasksCompleted: [],
              taskHistory: [],
            });
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            try {
              const newUserResponse = await axios.post(`${process.env.REACT_APP_API_URL}/user-info/`, {
                userID: tgUserID,
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
      } else {
        console.error('User ID not available from Telegram.');
      }
    };

    fetchPoints();
  }, []);

  return (
    <PointsContext.Provider value={{ points, setPoints, userID, setUserID, referrals }}>
      {children}
    </PointsContext.Provider>
  );
};
