import axios from 'axios';

export const getUserID = async (setUserID) => {
  // Fetch userID from Telegram
  const tgUserID = window.Telegram.WebApp?.initDataUnsafe?.user?.id;

  if (tgUserID) {
    setUserID(tgUserID);

    try {
      // Try to fetch the user's data from the backend
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${tgUserID}`);
      return tgUserID;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If the user is not found, create a new user on the backend
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/user-info/`, {
            userID: tgUserID,
            points: 0,
            tasksCompleted: [],
            taskHistory: [],
          });
        } catch (postError) {
          console.error('Error creating new user:', postError);
        }
      } else {
        console.error('Error fetching user data:', error);
      }
    }
  } else {
    console.error('User ID not available from Telegram.');
  }

  return tgUserID;
};
