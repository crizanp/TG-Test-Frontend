import axios from 'axios';

export const getUserID = async (setUserID, setUsername) => {
  
  const isLocalhost = window.location.hostname === 'localhost';

 
  let tgUserID = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
  let tgUsername = window.Telegram?.WebApp?.initDataUnsafe?.user?.username;

 
  if (isLocalhost) {
    tgUserID = 'mockUserID123';
    tgUsername = 'mockUsername';
    console.warn('Running on localhost: Mock Telegram user ID and username assigned.');
  }

  if (tgUserID) {
    tgUserID = tgUserID.toString();
    setUserID(tgUserID);

    if (tgUsername && setUsername) {
      setUsername(tgUsername);
    }

    try {
      
      await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${tgUserID}`);
      return tgUserID;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/user-info/`, {
            userID: tgUserID,
            username: tgUsername || 'Null Username', 
            points: 0,
            tasksCompleted: [],
            taskHistory: [],
          });
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
