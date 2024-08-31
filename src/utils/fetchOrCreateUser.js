import axios from 'axios';

export const fetchOrCreateUser = async (userID, setPoints) => {
  try {
    // Attempt to fetch the user's data from the backend
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user-info/${userID}`);
    setPoints(Math.round(response.data.points));  // Round to the nearest integer
    return response.data;  // Return the fetched data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // User not found, create a new user
      try {
        const newUserResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/user-info/register`, {
          userID,
          points: 0,
          tasksCompleted: [],
          taskHistory: [],
        });
        setPoints(Math.round(newUserResponse.data.points));  // Round to the nearest integer
        return newUserResponse.data;  // Return the newly created user data
      } catch (postError) {
        console.error('Error creating new user:', postError);
        throw postError;
      }
    } else {
      console.error('Error fetching user data:', error);
      throw error;  // Re-throw other errors
    }
  }
};
