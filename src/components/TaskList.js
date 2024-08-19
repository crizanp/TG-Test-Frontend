import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaChevronRight } from 'react-icons/fa';
import { GiClockwork } from 'react-icons/gi';
import { usePoints } from '../context/PointsContext';

const TaskContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background-color: #121212;
  color: white;
  padding-bottom: 80px;
  font-family: 'Arial', sans-serif;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    padding-bottom: 80px;
  }
`;

const TaskCategory = styled.div`
  margin-bottom: 20px;
`;

const TaskTitle = styled.h3`
  color: #ff9800;
  margin-bottom: 10px;
  text-align: center;
  font-weight: bold;
  font-size: 18px;
`;

const CoinLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  font-size: 48px;
`;

const CoinText = styled.div`
  text-align: center;
  color: #fff;
  font-size: 20px;
  margin-bottom: 10px;
  font-weight: bold;
`;

const TaskItem = styled.div`
  background-color: #1e1e1e;
  padding: 15px;
  margin: 5px;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.5);
  }

  ${({ completed }) =>
    completed &&
    `
    background-color: #2e7d32;
    cursor: default;
    &:hover {
      transform: none;
      box-shadow: none;
    }
  `}

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const TaskDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const TaskItemTitle = styled.div`
  font-size: 16px;
  color: #ffffff;
  margin-bottom: 5px;
  font-weight: bold;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const TaskPoints = styled.div`
  background-color: #ff9800;
  color: white;
  padding: 6px 10px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 14px;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const TaskIcon = styled.div`
  font-size: 20px;
  color: #ffffff;

  ${({ completed }) =>
    completed &&
    `
    font-size: 16px;
    color: #ffffff;
    background-color: #2e7d32;
    padding: 8px 12px;
    border-radius: 12px;
  `}

  @media (max-width: 480px) {
    font-size: 18px;

    ${({ completed }) =>
      completed &&
      `
      font-size: 14px;
    `}
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: flex-end;

  @media (max-width: 480px) {
    align-items: center;
  }
`;

const Modal = styled.div`
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 20px 20px 0 0;
  width: 100%;
  max-width: 400px;
  text-align: center;
  position: relative;

  @media (max-width: 768px) {
    padding: 15px;
    border-radius: 15px 15px 0 0;
  }

  @media (max-width: 480px) {
    padding: 10px;
    border-radius: 10px 10px 0 0;
  }
`;

const ModalHeader = styled.div`
  font-size: 24px;
  color: #ff9800;
  margin-bottom: 20px;
  font-weight: bold;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const ModalContent = styled.div`
  font-size: 16px;
  color: white;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const ModalButton = styled.button`
  background-color: #ff9800;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ffb74d;
  }

  &:disabled {
    background-color: grey;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 10px 20px;
  }
`;

const ClaimButton = styled(ModalButton)`
  background-color: green;
  margin-top: 20px;

  &:hover {
    background-color: #66bb6a;
  }

  &:disabled {
    background-color: grey;
    cursor: not-allowed;
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
  color: white;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const ProofInput = styled.input`
  background-color: #333;
  border: 2px solid #ff9800;
  padding: 12px;
  border-radius: 8px;
  width: calc(100% - 24px);
  color: white;
  margin-bottom: 20px;
  font-size: 18px;

  &:focus {
    outline: none;
    border-color: #ffb74d;
  }

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 16px;
  }
`;

const PointsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #4CAF50;
  color: white;
  padding: 15px 25px;
  border-radius: 12px;
  margin: 20px;
  font-size: 22px;
  font-weight: bold;

  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 18px;
  }
`;

const TotalPoints = styled.div`
  font-weight: bold;
`;

const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const TimerIcon = styled(GiClockwork)`
  font-size: 32px;
  color: #ff9800;
  animation: ${spinAnimation} 2s linear infinite;
  margin-top: 20px;

  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const TimerText = styled.div`
  color: #ff9800;
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

function TaskList() {
  const { points, setPoints } = usePoints();
  const [tasks, setTasks] = useState({ special: [], daily: [], lists: [] });
  const [selectedTask, setSelectedTask] = useState(null);
  const [proof, setProof] = useState('');
  const [isClaimable, setIsClaimable] = useState(false);
  const [underModeration, setUnderModeration] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({});
  const [timer, setTimer] = useState(30);
  const [timerStarted, setTimerStarted] = useState(false);


  useEffect(() => {
    // Fetch tasks dynamically from the API
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/igh-airdrop-tasks`);
        const data = await response.json();

        // Categorize tasks
        const categorizedTasks = {
          special: data.filter(task => task.category === 'Special'),
          daily: data.filter(task => task.category === 'Daily'),
          lists: data.filter(task => task.category === 'Lists'),
        };

        setTasks(categorizedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    let countdown;
    if (selectedTask && timerStarted && !isClaimable && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsClaimable(true);
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [selectedTask, timer, isClaimable, timerStarted]);

  const handleTaskClick = (task) => {
    if (!completedTasks[task._id]) {
      setSelectedTask(task);
      setProof('');
      setIsClaimable(false);
      setUnderModeration(false);
      setTimer(30);
      setTimerStarted(false);
    }
  };

  const handleStartTask = () => {
    window.open(selectedTask.link, '_blank');
    setTimerStarted(true);
  };

  const handleClaimReward = () => {
    setUnderModeration(true);
    setTimeout(() => {
      setPoints((prevPoints) => prevPoints + selectedTask.points);
      setCompletedTasks((prevTasks) => ({
        ...prevTasks,
        [selectedTask._id]: true,
      }));
      alert('Points awarded!');
      setSelectedTask(null);
    }, 30000);
  };

  const handleClose = () => {
    setSelectedTask(null);
  };

  return (
    <>
      <PointsContainer>
        <div>🌟 Total Points</div>
        <TotalPoints>{points.toFixed(2)}</TotalPoints>
      </PointsContainer>

      <TaskContainer>
        <CoinLogo>🪙</CoinLogo>
        <CoinText>Earn more tokens by completing tasks</CoinText>

        {Object.keys(tasks).map((category) => (
          <TaskCategory key={category}>
            <TaskTitle>{category.charAt(0).toUpperCase() + category.slice(1)} Tasks</TaskTitle>
            {tasks[category].map((task) => (
              <TaskItem
                key={task._id}
                completed={completedTasks[task._id]}
                onClick={() => handleTaskClick(task)}
              >
                <TaskDetails>
                  <TaskItemTitle>{task.name}</TaskItemTitle>
                  <TaskPoints>{task.points} pts</TaskPoints>
                </TaskDetails>
                <TaskIcon completed={completedTasks[task._id]}>
                  {completedTasks[task._id] ? 'Done' : <FaChevronRight />}
                </TaskIcon>
              </TaskItem>
            ))}
          </TaskCategory>
        ))}

        {selectedTask && (
          <ModalOverlay>
            <Modal>
              <CloseButton onClick={handleClose}>❌</CloseButton>
              <ModalHeader>{selectedTask.name}</ModalHeader>
              <ModalContent>{selectedTask.description}</ModalContent>
              {!timerStarted && !isClaimable && !underModeration ? (
                <ModalButton onClick={handleStartTask}>
                  Start Task
                </ModalButton>
              ) : null}

              {timerStarted && !isClaimable && !underModeration ? (
                <>
                  <TimerIcon />
                  <TimerText>{timer} seconds</TimerText>
                </>
              ) : null}

              {isClaimable && !underModeration ? (
                <>
                  <ProofInput
                    type="text"
                    placeholder="Enter your username or proof"
                    value={proof}
                    onChange={(e) => setProof(e.target.value)}
                  />
                  <ClaimButton
                    onClick={handleClaimReward}
                    disabled={!proof.trim()}
                  >
                    Claim Reward
                  </ClaimButton>
                </>
              ) : null}

              {underModeration && (
                <>
                  <ModalContent>
                    Task under moderation...
                  </ModalContent>
                  <TimerIcon />
                </>
              )}
            </Modal>
          </ModalOverlay>
        )}
      </TaskContainer>
    </>
  );
}

export default TaskList;
