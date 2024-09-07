// src/components/TaskList.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { usePoints } from "../context/PointsContext";
import { getUserID } from "../utils/getUserID";
import UserInfo from "./UserInfo";
import { FaChevronRight } from "react-icons/fa";
import FloatingMessage from "./FloatingMessage";
import { FaCrown } from "react-icons/fa"; // Crown icon from react-icons
import styled from "styled-components"; // Ensure this is present

import {
  TaskContainer,
  TaskCategory,
  TaskTitle,
  CoinText,
  PointsDisplayModal,
  TaskIcon,
  ModalOverlay,
  Modal,
  ModalHeader,
  ModalContent,
  ModalButton,
  ClaimButton,
  CloseButtonModel,
  ProofInput,
  PointsDisplayContainer,
  PointsDisplay,
  LoadingSpinner,
  CoinIcon,
} from "./TaskList.styles";

import coinIcon from "../assets/coin-icon.png"; // Add coin icon

// Styled component for the crown icon
export const CrownIcon = styled(FaCrown)`
  color: #ffd700; /* Gold color for the crown */
  font-size: 1.5rem;
  margin-top: -3px;
`;

const TaskItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => (props.$completed ? "#d4ffc32e" : "#d8d0d02b")};
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  min-height: 80px; /* Consistent height */
  box-sizing: border-box;
`;


const TaskDetailsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px; /* Ensures spacing between logo and text */
  flex-grow: 1; /* Make this container take available width */
`;

const TaskLogo = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px; /* Rounded corners for the logo */
`;
const ModalTaskLogo = styled(TaskLogo)`
  width: 150px;
  height: 150px;
  margin: 20px auto; /* Center the logo with margin */
  object-fit: contain;
  display: block; /* Ensures the image is centered */
  border-radius: 8px; /* Rounded corners */
`;

const TaskTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1; /* Ensure the text container takes up remaining space */
`;

const TaskTitleRow = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 5px;
`;

const TaskPointsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #fff;
  background-color: #24A1DE;
  padding: 5px 10px;
  border-radius: 4px;
  width: fit-content; /* Prevents stretching */
  box-sizing: border-box;
`;

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

  useEffect(() => {
    const initializeUserAndFetchTasks = async () => {
      setLoading(true);

      try {
        const userID = await getUserID(setUserID, setUsername);
        console.log("UserID fetched:", userID);

        const userResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/user-info/${userID}`
        );
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
        const tasksResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/igh-airdrop-tasks`
        );
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

      const userResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/user-info/${userID}`
      );
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

      setMessage({ text: "Points awarded!", type: "success" });
      setSelectedTask(null);
    } catch (error) {
      console.error("Error claiming reward:", error);
      setMessage({ text: "Error claiming the reward.", type: "error" });
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
          <img
            src="https://i.postimg.cc/y6Pn7xpB/square-3.png"
            alt="Logo Icon"
            style={{
              width: "100px",
              height: "100px",
              marginBottom: "19px",
              marginTop: "20px",
            }}
          />
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
              {tasks[category]
                .sort((a, b) => {
                  const isACompleted = completedTasks[a._id] ? 1 : 0;
                  const isBCompleted = completedTasks[b._id] ? 1 : 0;
                  return isACompleted - isBCompleted;
                })
                .map((task) => (
                  <TaskItemContainer
                    key={task._id}
                    $completed={completedTasks[task._id]}
                    onClick={() => handleTaskClick(task)}
                  >
                    <TaskDetailsContainer>
                      <TaskLogo
                        src={task.logo || "https://via.placeholder.com/50"} // Fallback URL for missing logos
                        alt={`${task.name} logo`}
                      />
                      <TaskTextContainer>
                        <TaskTitleRow>{task.name}</TaskTitleRow>
                        <TaskPointsContainer>
                          <CrownIcon />
                          {task.points}
                        </TaskPointsContainer>
                      </TaskTextContainer>
                    </TaskDetailsContainer>

                    <TaskIcon $completed={completedTasks[task._id]}>
                      {completedTasks[task._id] ? "Done" : <FaChevronRight />}
                    </TaskIcon>
                  </TaskItemContainer>
                ))}
            </TaskCategory>
          ))}

          {selectedTask && (
            <ModalOverlay>
              <Modal>
                <CloseButtonModel onClick={handleClose} />
                {/* Modal Logo Centered and Bigger */}
                <ModalTaskLogo
                  src={selectedTask.logo || "https://via.placeholder.com/50"}
                  alt={`${selectedTask.name} logo`}
                />
                <ModalHeader>{selectedTask.name}</ModalHeader>
                <PointsDisplayModal>
                  <CoinIcon src={coinIcon} alt="Coin Icon" />+
                  {selectedTask.points} IGH
                </PointsDisplayModal>
                <ModalContent>{selectedTask.description}</ModalContent>

                {isClaimable && !underModeration ? (
                  <>
                    <ProofInput
                      type="text"
                      placeholder={selectedTask.proofPlaceholder}
                      value={proof}
                      onChange={(e) => setProof(e.target.value)}
                    />
                    <ClaimButton
                      onClick={handleClaimReward}
                      disabled={!proof.trim() || underModeration}
                    >
                      {underModeration ? "Claiming..." : "Claim Reward"}
                    </ClaimButton>
                  </>
                ) : null}

                {!timerStarted && !isClaimable && !underModeration ? (
                  <ModalButton onClick={handleStartTask}>Start Task</ModalButton>
                ) : timerStarted && !isClaimable ? (
                  <ModalButton disabled>Processing...</ModalButton>
                ) : null}

                {underModeration && (
                  <ModalContent>Task under moderation...</ModalContent>
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
