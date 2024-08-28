import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const PointsContext = createContext();

export const usePoints = () => {
  return useContext(PointsContext);
};

export const PointsProvider = ({ children }) => {
  const [points, setPoints] = useState(0);
  const [userID, setUserID] = useState('');
  const [referrals, setReferrals] = useState(0);

  useEffect(() => {
    const fetchPoints = async () => {
      let tgUserID = window.Telegram.WebApp?.initDataUnsafe?.user?.id;
  
      if (tgUserID) {
        tgUserID = tgUserID.toString().slice(0, 8);
        setUserID(tgUserID);
  
        const urlParams = new URLSearchParams(window.location.search);
        const referrerID = urlParams.get('start');  // Get the referrer ID from the URL
  
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${tgUserID}`);
          setPoints(Math.round(response.data.points));
          setReferrals(response.data.referrals || 0);
  
          if (referrerID && !response.data.referrer) {
            // Create the user with the referrerID
            await axios.post(`${process.env.REACT_APP_API_URL}/user-info/`, {
              userID: tgUserID,
              referrerID: referrerID,  // Pass referrerID to the backend
              points: 0,
              tasksCompleted: [],
              taskHistory: [],
            });
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            // Create a new user if not found
            try {
              const newUserResponse = await axios.post(`${process.env.REACT_APP_API_URL}/user-info/`, {
                userID: tgUserID,
                points: 0,
                tasksCompleted: [],
                taskHistory: [],
                referrerID: referrerID || null,  // Pass referrerID to the backend
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
  
  

  const updatePoints = async (pointsToAdd) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/update-points/${userID}`, {
        pointsToAdd,
      });
      setPoints(response.data.points);
    } catch (error) {
      console.error('Failed to update points:', error);
    }
  };

  return (
    <PointsContext.Provider value={{ points, setPoints, userID, setUserID, referrals, updatePoints }}>
      {children}
    </PointsContext.Provider>
  );
};
