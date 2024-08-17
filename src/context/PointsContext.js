import React, { createContext, useContext, useState, useEffect } from 'react';

const PointsContext = createContext();

export const PointsProvider = ({ children }) => {
  const [points, setPoints] = useState(() => {
    // Retrieve the points from localStorage and ensure they are a valid number
    const savedPoints = localStorage.getItem('points');
    const parsedPoints = parseFloat(savedPoints);
    
    // Return parsed points if it's a valid number, otherwise return 0
    return !isNaN(parsedPoints) ? parsedPoints : 0;
  });

  useEffect(() => {
    // Whenever the points change, save them to localStorage as a number
    if (!isNaN(points)) {
      localStorage.setItem('points', points.toString());
    }
  }, [points]);

  return (
    <PointsContext.Provider value={{ points, setPoints }}>
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => {
  return useContext(PointsContext);
};
