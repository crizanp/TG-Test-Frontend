// src/utils/getUserID.js

import axios from 'axios';

export const getUserID = async (setUserID, setUsername) => {
  let tgUserID = window.Telegram.WebApp?.initDataUnsafe?.user?.id;
  let tgUsername = window.Telegram.WebApp?.initDataUnsafe?.user?.username;

  if (tgUserID) {
    tgUserID = tgUserID.toString();
    setUserID(tgUserID);

    if (tgUsername && setUsername) {
      setUsername(tgUsername);
    }

    try {
      // Try to fetch the user's data from the backend
      await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${tgUserID}`);
      return tgUserID;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If the user is not found, create a new user on the backend
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/user-info/`, {
            userID: tgUserID,
            username: tgUsername || 'default_username', // handle case if username is not provided
            points: 0,
            tasksCompleted: [],
            taskHistory: [],
          });
          return tgUserID;
        } catch (postError) {
          console.error('Error creating new user:', postError);
          throw postError;  // Rethrow the error if user creation fails
        }
      } else {
        console.error('Error fetching user data:', error);
        throw error;  // Rethrow any other errors
      }
    }
  } else {
    console.error('User ID not available from Telegram.');
    throw new Error('User ID not available from Telegram.');
  }
};
