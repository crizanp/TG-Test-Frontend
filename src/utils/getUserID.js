import axios from 'axios';

export const getUserID = async (setUserID, setUsername) => {
  // Check if running on localhost
  const isLocalhost = window.location.hostname === 'localhost';

  // Fetch userID and username from Telegram
  const tgUserID = window.Telegram.WebApp?.initDataUnsafe?.user?.id;
  let tgUsername = window.Telegram.WebApp?.initDataUnsafe?.user?.username;

  // Set a default username if not provided by Telegram
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
            tasksCompleted: [],
            taskHistory: [],
          });
          return { userID: tgUserID, username: tgUsername };
        } catch (postError) {
          console.error('Error creating new user:', postError);
          throw postError;  // Rethrow the error if user creation fails
        }
      } else {
        console.error('Error fetching user data:', error);
        throw error;  // Rethrow any other errors
      }
    }
  } else if (isLocalhost) {
    // If running on localhost, generate a dummy userID and username for testing
    const dummyUserID = '12345678'; // You can change this to any string
    const dummyUsername = 'tester';
    setUserID(dummyUserID);
    setUsername(dummyUsername);
    console.log('Using dummy userID:', dummyUserID);
    return { userID: dummyUserID, username: dummyUsername };
  } else {
    console.error('User ID not available from Telegram.');
    throw new Error('User ID not available from Telegram.');
  }
};
