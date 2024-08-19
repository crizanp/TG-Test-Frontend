import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const TaskContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background-color: #121212;
  color: white;
  padding-bottom: 80px;
`;

const TaskItem = styled.div`
  background-color: #1e1e1e;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TaskTitle = styled.h3`
  font-size: 18px;
  color: #ff9800;
`;

const TaskPoints = styled.div`
  font-size: 14px;
  color: #4caf50;
`;

function IGHAirdropTaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/igh-airdrop-tasks');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <TaskContainer>
      {tasks.map((task) => (
        <TaskItem key={task._id}>
          <TaskTitle>{task.name}</TaskTitle>
          <TaskPoints>{task.points} pts</TaskPoints>
        </TaskItem>
      ))}
    </TaskContainer>
  );
}

export default IGHAirdropTaskList;
