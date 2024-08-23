// src/utils/getUserID.js
import axios from 'axios';

export const getUserID = async (setUserID) => {
  let userID = localStorage.getItem('userID');

  if (!userID) {
    userID = Math.floor(10000000 + Math.random() * 90000000).toString();
    localStorage.setItem('userID', userID);
    setUserID(userID);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/user-info/`, {
        userID,
        points: 0,
        tasksCompleted: [],
        taskHistory: [],
      });
    } catch (error) {
      console.error('Error creating new user:', error);
    }
  }

  return userID;
};
