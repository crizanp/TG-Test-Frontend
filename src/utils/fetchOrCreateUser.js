import axios from 'axios';

export const fetchOrCreateUser = async (userID, setPoints) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user-info/${userID}`);
    setPoints(Math.round(response.data.points));  
    return response.data;  a
  } catch (error) {
    if (error.response && error.response.status === 404) {
      try {
        const newUserResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/user-info/register`, {
          userID,
          points: 0,
          tasksCompleted: [],
          taskHistory: [],
        });
        setPoints(Math.round(newUserResponse.data.points));  
        return newUserResponse.data;  
      } catch (postError) {
        console.error('Error creating new user:', postError);
        throw postError;
      }
    } else {
      console.error('Error fetching user data:', error);
      throw error;  
    }
  }
};
