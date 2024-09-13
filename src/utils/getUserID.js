import axios from 'axios';

export const getUserID = async (setUserID, setUsername) => {
  const isLocalhost = window.location.hostname === 'localhost';

  // Get user data from Telegram Web App initialization data
  let tgUserID = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
  let tgUsername = window.Telegram?.WebApp?.initDataUnsafe?.user?.username;
  let referrerID = window.Telegram?.WebApp?.initDataUnsafe?.start_param; // Get referrer ID from start_param

  // Mock data for localhost (development testing)
  if (isLocalhost) {
    tgUserID = 'mockUserID123';
    tgUsername = 'mockUsername';
    referrerID = 'mockReferrerID';
    console.warn('Running on localhost: Mock Telegram user ID, username, and referral assigned.');
  }

  if (tgUserID) {
    tgUserID = tgUserID.toString();
    setUserID(tgUserID);

    if (tgUsername && setUsername) {
      setUsername(tgUsername);
    }

    try {
      // Check if the user exists in the database
      await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${tgUserID}`);

      // If the user was referred, update the referral status to complete
      if (referrerID) {
        await axios.put(`${process.env.REACT_APP_API_URL}/referrals/complete/${tgUserID}`, {
          referrerID,
        });
      }

      return tgUserID;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If the user does not exist, register the user
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/user-info/`, {
            userID: tgUserID,
            username: tgUsername || 'Null Username',
            points: 0,
            tasksCompleted: [],
            taskHistory: [],
          });

          // If the user was referred, update the referral status to complete
          if (referrerID) {
            await axios.put(`${process.env.REACT_APP_API_URL}/referrals/complete/${tgUserID}`, {
              referrerID,
            });
          }

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
