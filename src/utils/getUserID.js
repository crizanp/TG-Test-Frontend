import axios from 'axios';

export const getUserID = async (setUserID, setUsername) => {
  let tgUserID = window.Telegram.WebApp?.initDataUnsafe?.user?.id;
  const tgUsername = window.Telegram.WebApp?.initDataUnsafe?.user?.username;

  if (tgUserID) {
    tgUserID = tgUserID.toString();
    setUserID(tgUserID);
    setUsername(tgUsername);

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${tgUserID}`);
      return tgUserID;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        try {
          const newUserResponse = await axios.post(`${process.env.REACT_APP_API_URL}/user-info/`, {
            userID: tgUserID,
            username: tgUsername,
            points: 0,
            tasksCompleted: [],
            taskHistory: [],
          });
          console.log('New user created:', newUserResponse.data);
          return tgUserID;
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
