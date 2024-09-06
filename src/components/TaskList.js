import React, { useState, useEffect } from "react";
import axios from "axios";
import { usePoints } from "../context/PointsContext";
import { getUserID } from "../utils/getUserID";
import UserInfo from "./UserInfo";
import { FaChevronRight } from "react-icons/fa";
import FloatingMessage from './FloatingMessage';

// Importing required styles and images
import {
  TaskContainer,
  TaskCategory,
  TaskTitle,
  CoinText,
  Logo,
  PointsDisplayModal,
  TaskItem,
  TaskDetails,
  TaskItemTitle,
  TaskPoints,
  TaskIcon,
  ModalOverlay,
  Modal,
  ModalHeader,
  ModalContent,
  ModalButton,
  ClaimButton,
  CloseButton,
  ProofInput,
  TimerIcon,
  TimerText,
  PointsDisplayContainer,
  PointsDisplay,
  DollarIcon,
  CloseButtonModel,
  LoadingSpinner,
} from "./TaskList.styles";
import dollarImage from "../assets/dollar-homepage.png";

const TaskList = () => {
  const { points, setPoints, userID, setUserID, setUsername } = usePoints();
  const [tasks, setTasks] = useState({ special: [], daily: [], lists: [] });
  const [selectedTask, setSelectedTask] = useState(null);
  const [proof, setProof] = useState("");
  const [isClaimable, setIsClaimable] = useState(false);
  const [underModeration, setUnderModeration] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({});
  const [timer, setTimer] = useState(10);
  const [timerStarted, setTimerStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerHeight < 500) {
        setIsKeyboardVisible(true);
      } else {
        setIsKeyboardVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const initializeUserAndFetchTasks = async () => {
      setLoading(true);

      try {
        const userID = await getUserID(setUserID, setUsername);
        console.log("UserID fetched:", userID);

        const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${userID}`);
        const userData = userResponse.data;

        setPoints(userData.points);

        const completedTasksMap = {};
        userData.tasksCompleted.forEach((taskId) => {
          completedTasksMap[taskId] = true;
        });
        setCompletedTasks(completedTasksMap);
      } catch (error) {
        console.error("Unexpected error fetching user data:", error);
      }

      try {
        const tasksResponse = await axios.get(`${process.env.REACT_APP_API_URL}/igh-airdrop-tasks`);
        const data = tasksResponse.data;

        const categorizedTasks = {
          special: data.filter((task) => task.category === "Special"),
          daily: data.filter((task) => task.category === "Daily"),
          lists: data.filter((task) => task.category === "Lists"),
        };

        setTasks(categorizedTasks);
      } catch (taskFetchError) {
        console.error("Error fetching tasks:", taskFetchError);
      } finally {
        setLoading(false);
      }
    };

    initializeUserAndFetchTasks();
  }, [setPoints, setUserID, setUsername]);

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
  }, [selectedTask, timerStarted, isClaimable, timer]);

  const handleTaskClick = (task) => {
    if (!completedTasks[task._id]) {
      setSelectedTask(task);
      setProof("");
      setIsClaimable(false);
      setUnderModeration(false);
      setTimer(10);
      setTimerStarted(false);
    }
  };

  const handleStartTask = () => {
    window.open(selectedTask.link, "_blank");
    setTimerStarted(true);
  };

  const handleClaimReward = async () => {
    setUnderModeration(true);

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/user-info/update-points/${userID}`,
        {
          pointsToAdd: selectedTask.points,
          username: window.Telegram.WebApp?.initDataUnsafe?.user?.username,
        }
      );

      const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${userID}`);
      setPoints(userResponse.data.points);

      await axios.post(`${process.env.REACT_APP_API_URL}/user-info`, {
        userID,
        tasksCompleted: [selectedTask._id],
        taskHistory: [
          {
            taskId: selectedTask._id,
            pointsEarned: selectedTask.points,
            completedAt: new Date(),
          },
        ],
      });

      setCompletedTasks((prevTasks) => ({
        ...prevTasks,
        [selectedTask._id]: true,
      }));

      setMessage({ text: 'Points awarded!', type: 'success' });
      setSelectedTask(null);
    } catch (error) {
      console.error("Error claiming reward:", error);
      setMessage({ text: 'Error claiming the reward.', type: 'error' });
    } finally {
      setUnderModeration(false);
    }
  };

  const handleClose = () => {
    setSelectedTask(null);
  };

  return (
    <>
      {message && (
        <FloatingMessage
          message={message.text}
          type={message.type}
          duration={3000}
          onClose={() => setMessage(null)}
        />
      )}

      <PointsDisplayContainer id="pointsDisplay">
        <UserInfo userID={userID} points={points} />
        <PointsDisplay>
          <DollarIcon src={dollarImage} alt="Dollar Icon" />{" "}
          {Math.floor(points)}
        </PointsDisplay>
      </PointsDisplayContainer>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <TaskContainer>
          <CoinText>Earn more tokens by completing tasks</CoinText>

          {Object.keys(tasks).map((category) => (
            <TaskCategory key={category}>
              <TaskTitle>
                {category.charAt(0).toUpperCase() + category.slice(1)} Tasks
              </TaskTitle>
              {tasks[category].map((task) => (
                <TaskItem
                  key={task._id}
                  $completed={completedTasks[task._id]}
                  onClick={() => handleTaskClick(task)}
                >
                  <TaskDetails>
                    <TaskItemTitle>{task.name}</TaskItemTitle>
                    <TaskPoints>{task.points} pts</TaskPoints>
                  </TaskDetails>
                  <TaskIcon $completed={completedTasks[task._id]}>
                    {completedTasks[task._id] ? "Done" : <FaChevronRight />}
                  </TaskIcon>
                </TaskItem>
              ))}
            </TaskCategory>
          ))}
          {selectedTask && (
            <ModalOverlay>
              <Modal isKeyboardVisible={isKeyboardVisible}>
                <CloseButtonModel onClick={handleClose} /> {/* Close Button */}

                {/* Logo Section */}
                <Logo src="https://png.pngtree.com/png-clipart/20230401/original/pngtree-three-dimensional-instagram-icon-png-image_9015419.png" alt="Logo" />

                {/* Title */}
                <ModalHeader>{selectedTask.name}</ModalHeader>

                {/* Points Display */}
                <PointsDisplayModal>+{selectedTask.points} IGH</PointsDisplayModal>

                {/* Description */}
                <ModalContent>{selectedTask.description}</ModalContent>

                {/* Proof Input and Claim Button */}
                {isClaimable && !underModeration ? (
                  <>
                    <ProofInput
                      type="text"
                      placeholder={selectedTask.proofPlaceholder}
                      value={proof}
                      onChange={(e) => setProof(e.target.value)}
                    />

                    {/* Claim Reward Button */}
                    <ClaimButton
                      onClick={handleClaimReward}
                      disabled={!proof.trim() || underModeration} // Disable if proof is empty or in moderation
                    >
                      {underModeration ? 'Claiming...' : 'Claim Reward'} {/* Show "Claiming..." when processing */}
                    </ClaimButton>
                  </>
                ) : null}

                {/* Start Task and Processing Button */}
                {!timerStarted && !isClaimable && !underModeration ? (
                  <ModalButton onClick={handleStartTask}>
                    Start Task
                  </ModalButton>
                ) : timerStarted && !isClaimable ? (
                  <ModalButton disabled>Processing...</ModalButton>
                ) : null}

                {/* Moderation Section */}
                {underModeration && (
                  <>
                    <ModalContent>Task under moderation...</ModalContent>
                    <TimerIcon />
                  </>
                )}
              </Modal>
            </ModalOverlay>
          )}
        </TaskContainer>
      )}
    </>
  );
};

export default TaskList;
