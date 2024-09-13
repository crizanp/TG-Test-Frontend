import axios from 'axios';

export const getUserID = async (setUserID, setUsername) => {
  
  const isLocalhost = window.location.hostname === 'localhost';

  // Get the Telegram user ID and username from the Telegram Web App
  let tgUserID = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
  let tgUsername = window.Telegram?.WebApp?.initDataUnsafe?.user?.username;

  // For localhost testing
  if (isLocalhost) {
    tgUserID = 'mockUserID123';
    tgUsername = 'mockUsername';
    console.warn('Running on localhost: Mock Telegram user ID and username assigned.');
  }

  // Ensure tgUserID exists
  if (tgUserID) {
    tgUserID = tgUserID.toString();
    setUserID(tgUserID);

    if (tgUsername && setUsername) {
      setUsername(tgUsername);
    }

    try {
      // Check if the user already exists in the database
      await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${tgUserID}`);

      // Now check if the user is in the referral list as a referredID
      await checkAndCompleteReferral(tgUserID);

      return tgUserID;

    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If the user does not exist, create the user
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/user-info/`, {
            userID: tgUserID,
            username: tgUsername || 'Null Username',
            points: 0,
            tasksCompleted: [],
            taskHistory: [],
          });

          // After registering the user, check if they are a referred user
          await checkAndCompleteReferral(tgUserID);

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

// Function to check referral and update status to complete if the user is referred
const checkAndCompleteReferral = async (tgUserID) => {
  try {
    // Make a request to check if this user is in the referral system
    const referralResponse = await axios.get(`${process.env.REACT_APP_API_URL}/referrals/check/${tgUserID}`);

    // If referral exists and is incomplete, update it to complete
    if (referralResponse.data && referralResponse.data.status === 'incomplete') {
      await axios.put(`${process.env.REACT_APP_API_URL}/referrals/complete/${tgUserID}`);
      console.log(`Referral for user ${tgUserID} marked as complete.`);
    }
  } catch (error) {
    console.error('Error checking or completing referral:', error);
  }
};
