import axios from 'axios';

export const getUserID = async (setUserID, setUsername) => {
  const tgUserID = window.Telegram.WebApp?.initDataUnsafe?.user?.id;
  let tgUsername = window.Telegram.WebApp?.initDataUnsafe?.user?.username;
  const referrerID = window.Telegram.WebApp?.initDataUnsafe?.start_param; // Captures the referrer ID

  if (!tgUsername) {
    tgUsername = 'no-username';
  }

  if (tgUserID) {
    setUserID(tgUserID);
    setUsername(tgUsername);

    try {
      // Try to fetch the user's data from the backend
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${tgUserID}`);
      return { userID: tgUserID, username: tgUsername };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If the user is not found, create a new user on the backend
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/user-info/`, {
            userID: tgUserID,
            username: tgUsername,
            points: 0,
            referrerID: referrerID || null, // Pass the referrerID here, ensuring it's nullable
            tasksCompleted: [],
            taskHistory: [],
          });
          return { userID: tgUserID, username: tgUsername };
        } catch (postError) {
          console.error('Error creating new user:', postError);
          throw postError;
        }
      } else {
        console.error('Error fetching user data:', error);
        throw error;
      }
    }
  } else {
    console.error('User ID not available from Telegram.');
    throw new Error('User ID not available from Telegram.');
  }
};
