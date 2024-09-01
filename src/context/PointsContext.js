const PointsProvider = ({ children }) => {
  const [points, setPoints] = useState(0);
  const [userID, setUserID] = useState('');
  const [username, setUsername] = useState('');  // New state for username

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userID = await getUserID(setUserID, setUsername);
        setUserID(userID);

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${userID}`);
        setPoints(Math.round(response.data.points));

        if (response.data.username) {
          setUsername(response.data.username);  // Set the username from the response
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [setUserID, setPoints]);

  return (
    <PointsContext.Provider value={{ points, setPoints, userID, username }}>
      {children}
    </PointsContext.Provider>
  );
};
