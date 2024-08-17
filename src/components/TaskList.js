import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaChevronRight } from 'react-icons/fa';
import { GiClockwork } from 'react-icons/gi';

const TaskContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #121212;
  min-height: 100vh;
  color: white;
  padding-bottom: 100px; /* Ensure space for the bottom menu */
  font-family: 'Arial', sans-serif;
`;

const TaskCategory = styled.div`
  margin-bottom: 30px;
`;

const TaskTitle = styled.h3`
  color: #ff9800;
  margin-bottom: 10px;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
`;

const CoinLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  font-size: 64px;
`;

const CoinText = styled.div`
  text-align: center;
  color: #fff;
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: bold;
`;

const TaskItem = styled.div`
  background-color: #1e1e1e;
  padding: 20px;
  margin: 10px;
  border-radius: 20px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
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
`;

const TaskDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const TaskItemTitle = styled.div`
  font-size: 18px;
  color: #ffffff;
  margin-bottom: 5px;
  font-weight: bold;
`;

const TaskPoints = styled.div`
  background-color: #ff9800;
  color: white;
  padding: 8px 12px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 16px;
`;

const TaskIcon = styled.div`
  font-size: 24px;
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
`;

const Modal = styled.div`
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 20px 20px 0 0;
  width: 100%;
  max-width: 400px;
  text-align: center;
  position: relative;
  animation: slide-up 0.3s ease-out forwards;

  @keyframes slide-up {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  font-size: 28px;
  color: #ff9800;
  margin-bottom: 20px;
  font-weight: bold;
`;

const ModalContent = styled.div`
  font-size: 18px;
  color: white;
  margin-bottom: 20px;
`;

const ModalButton = styled.button`
  background-color: #ff9800;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ffb74d;
  }

  &:disabled {
    background-color: grey;
    cursor: not-allowed;
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
`;

const PointsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #4CAF50;
  color: white;
  padding: 15px 25px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: bold;
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
`;

const LoadingIcon = styled.div`
  font-size: 32px;
  color: #ff9800;
  margin-top: 20px;
  &::after {
    content: "⏳";
    animation: ${spinAnimation} 2s linear infinite;
  }
`;

const TimerText = styled.div`
  color: #ff9800;
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
`;

const tasks = {
  special: [
    { id: 1, title: 'Follow Twitter', points: 20, emoji: '🎯', description: 'Follow our official Twitter account.', link: 'https://twitter.com' },
    { id: 2, title: 'Retweet Post', points: 30, emoji: '⭐', description: 'Retweet the latest post from our account.', link: 'https://twitter.com' },
  ],
  daily: [
    { id: 3, title: 'Join Telegram', points: 10, emoji: '📅', description: 'Join our official Telegram group.', link: 'https://telegram.org' },
    { id: 4, title: 'Watch YouTube Video', points: 10, emoji: '⏰', description: 'Watch our latest video on YouTube.', link: 'https://youtube.com' },
  ],
  list: [
    { id: 5, title: 'Like Facebook Page', points: 5, emoji: '✅', description: 'Like our Facebook page.', link: 'https://facebook.com' },
    { id: 6, title: 'Comment on Post', points: 5, emoji: '💬', description: 'Comment on our latest post.', link: 'https://facebook.com' },
    { id: 7, title: 'Visit Website', points: 5, emoji: '📈', description: 'Visit our official website.', link: 'https://example.com' },
    { id: 8, title: 'Share Instagram Post', points: 5, emoji: '📊', description: 'Share our post on Instagram.', link: 'https://instagram.com' },
    { id: 9, title: 'Follow on LinkedIn', points: 5, emoji: '🔗', description: 'Follow us on LinkedIn.', link: 'https://linkedin.com' },
    { id: 10, title: 'Join Discord Server', points: 5, emoji: '💻', description: 'Join our Discord community.', link: 'https://discord.com' },
  ],
};

function TaskList() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [proof, setProof] = useState('');
  const [isClaimable, setIsClaimable] = useState(false);
  const [underModeration, setUnderModeration] = useState(false);
  const [totalPoints, setTotalPoints] = useState(50);
  const [completedTasks, setCompletedTasks] = useState({});
  const [timer, setTimer] = useState(30);
  const [timerStarted, setTimerStarted] = useState(false);

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
    if (!completedTasks[task.id]) {
      setSelectedTask(task);
      setProof('');
      setIsClaimable(false);
      setUnderModeration(false);
      setTimer(30); // Reset the timer to 30 seconds
      setTimerStarted(false); // Ensure the timer hasn't started yet
    }
  };

  const handleStartTask = () => {
    window.open(selectedTask.link, '_blank');
    setTimerStarted(true); // Start the timer when the task is started
  };

  const handleClaimReward = () => {
    setUnderModeration(true);
    setTimeout(() => {
      setTotalPoints((prevPoints) => prevPoints + selectedTask.points);
      setCompletedTasks((prevTasks) => ({
        ...prevTasks,
        [selectedTask.id]: true,
      }));
      alert('Points awarded!');
      setSelectedTask(null);
    }, 30000); // 30 seconds moderation time
  };

  const handleClose = () => {
    setSelectedTask(null);
  };

  return (
    <>
      <PointsContainer>
        <div>🌟 Total Points</div>
        <TotalPoints>{totalPoints}</TotalPoints>
      </PointsContainer>

      <TaskContainer>
        <CoinLogo>🪙</CoinLogo>
        <CoinText>Earn more tokens by completing tasks</CoinText>

        {Object.keys(tasks).map((category) => (
          <TaskCategory key={category}>
            <TaskTitle>{category.charAt(0).toUpperCase() + category.slice(1)} Tasks</TaskTitle>
            {tasks[category].map((task) => (
              <TaskItem
                key={task.id}
                completed={completedTasks[task.id]}
                onClick={() => handleTaskClick(task)}
              >
                <TaskDetails>
                  <TaskItemTitle>{task.title}</TaskItemTitle>
                  <TaskPoints>{task.points} pts</TaskPoints>
                </TaskDetails>
                <TaskIcon completed={completedTasks[task.id]}>
                  {completedTasks[task.id] ? 'Done' : <FaChevronRight />}
                </TaskIcon>
              </TaskItem>
            ))}
          </TaskCategory>
        ))}

        {selectedTask && (
          <ModalOverlay>
            <Modal>
              <CloseButton onClick={handleClose}>❌</CloseButton>
              <ModalHeader>{selectedTask.title}</ModalHeader>
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
                  <LoadingIcon />
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
