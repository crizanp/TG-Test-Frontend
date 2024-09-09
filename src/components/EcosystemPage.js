import React, { useState, useEffect } from "react";
import axios from "axios";
import { usePoints } from "../context/PointsContext";
import UserInfo from "./UserInfo";
import styled from "styled-components";
import FloatingMessage from "./FloatingMessage";
import Modal from "./Modal"; // Modal for showing correct answer

import {
  QuizContainer,
  ScrollableContent,
  QuizBox,
  QuestionText,
  Option,
  SubmitButton,
  HeaderText,
  CategoryContainer,
  CategoryButton,
  NextButton,
  NoQuestionsMessage,
} from "./EcosystemStyles";

// Styled Components for Points and Quiz Container
const CorrectAnswerButton = styled.button`
  background-color: #0088cc;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;

  &:hover {
    background-color: #00aced;
  }
`;

function EcosystemPage() {
  const { points, setPoints, userID } = usePoints();
  const [categories, setCategories] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("random");
  const [loading, setLoading] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [correctOption, setCorrectOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [noMoreQuizzes, setNoMoreQuizzes] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [showCorrectAnswerModal, setShowCorrectAnswerModal] = useState(false);
  const [floatingMessage, setFloatingMessage] = useState(null); // Floating message state
  const [floatingMessageType, setFloatingMessageType] = useState("success"); // Floating message type

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/category/categories`
        );
        setCategories([{ name: "Random", _id: "random" }, ...response.data]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch remaining quizzes when userID or selectedCategory changes
  useEffect(() => {
    const fetchRemainingQuizzes = async () => {
      try {
        let url = `${process.env.REACT_APP_API_URL}/user-info/${userID}/remaining-quizzes`;

        if (selectedCategory === "Random") {
          url = `${process.env.REACT_APP_API_URL}/user-info/${userID}/remaining-quizzes`;
        } else {
          url += `?category=${selectedCategory}`;
        }

        const response = await axios.get(url);

        if (
          !response.data ||
          response.data.message === "No remaining quizzes found"
        ) {
          setCurrentQuiz(null);
          setNoMoreQuizzes(true);
        } else {
          setCurrentQuiz(response.data[0]);
          setNoMoreQuizzes(false);
        }

        // Reset states when new quiz is loaded
        setLoading(false);
        setSelectedOption(null);
        setDisableSubmit(false);
        setCorrectOption(null);
        setShowFeedback(false);
        setShowCorrectAnswer(false); // Reset correct answer visibility
      } catch (error) {
        console.error("Error fetching remaining quizzes:", error);
        setLoading(false);
        setCurrentQuiz(null);
        setNoMoreQuizzes(true);
      }
    };

    fetchRemainingQuizzes();
  }, [userID, selectedCategory]);

  const handleOptionSelect = (index) => {
    if (!disableSubmit) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = async () => {
    if (selectedOption === null) return;

    const isCorrect = currentQuiz.options[selectedOption].isCorrect;
    const pointsEarned = isCorrect ? currentQuiz.points : 0;

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/user-info/submit-quiz`,
        {
          userID,
          quizId: currentQuiz._id,
          pointsEarned,
        }
      );

      setPoints((prevPoints) => prevPoints + pointsEarned);
      setDisableSubmit(true);
      setCorrectOption(
        isCorrect
          ? selectedOption
          : currentQuiz.options.findIndex((option) => option.isCorrect)
      );
      setShowFeedback(true);

      // Set floating message based on whether the answer is correct or wrong
      if (isCorrect) {
        setFloatingMessage("Correct answer!");
        setFloatingMessageType("success");
      } else {
        setFloatingMessage("Wrong answer!");
        setFloatingMessageType("error");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const handleShowCorrectAnswer = () => {
    setShowCorrectAnswerModal(true);
  };

  const handleGoAhead = () => {
    setPoints((prevPoints) => prevPoints - 50);
    setShowCorrectAnswer(true);
    setShowCorrectAnswerModal(false); // Close the modal after deduction
  };

  const handleNextQuiz = async () => {
    // Reset the state before loading the new quiz
    setSelectedOption(null);
    setDisableSubmit(false);
    setCorrectOption(null);
    setShowFeedback(false);
    setShowCorrectAnswer(false);
    setFloatingMessage(null); // Clear floating message on next quiz

    setLoading(true);

    try {
      let url = `${process.env.REACT_APP_API_URL}/user-info/${userID}/remaining-quizzes`;

      if (selectedCategory === "Random") {
        url = `${process.env.REACT_APP_API_URL}/user-info/${userID}/remaining-quizzes`;
      } else {
        url += `?category=${selectedCategory}`;
      }

      const response = await axios.get(url);

      if (
        !response.data ||
        response.data.message === "No remaining quizzes found"
      ) {
        setCurrentQuiz(null);
        setNoMoreQuizzes(true);
      } else {
        setCurrentQuiz(response.data[0]);
        setSelectedOption(null);
        setDisableSubmit(false);
        setCorrectOption(null);
        setShowFeedback(false);
        setShowCorrectAnswer(false);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching next quiz:", error);
      setLoading(false);
      setCurrentQuiz(null);
      setNoMoreQuizzes(true);
    }
  };

  return (
    <>
      {/* Floating message placed at the top of the quiz container */}
      {floatingMessage && (
        <FloatingMessage
          message={floatingMessage}
          type={floatingMessageType}
          duration={3000}
          onClose={() => setFloatingMessage(null)}
        />
      )}

      <QuizContainer key={currentQuiz ? currentQuiz._id : "no-quiz"}>
        <UserInfo />
        <HeaderText>Answer and Earn</HeaderText>

        <CategoryContainer>
          {categories.map((category) => (
            <CategoryButton
              key={category._id}
              selected={category.name === selectedCategory}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </CategoryButton>
          ))}
        </CategoryContainer>

        <ScrollableContent>
          {loading ? (
            <p>Loading quiz...</p>
          ) : noMoreQuizzes ? (
            <NoQuestionsMessage>
              You are all done! No remaining quizzes available.
            </NoQuestionsMessage>
          ) : currentQuiz ? (
            <QuizBox>
              <QuestionText>{currentQuiz.questionText}</QuestionText>
              {currentQuiz.options.map((option, index) => (
                <Option
                  key={index}
                  $selected={selectedOption === index}
                  $correct={showFeedback && index === correctOption}
                  $wrong={
                    showFeedback &&
                    index === selectedOption &&
                    !option.isCorrect
                  }
                  $isDisabled={disableSubmit}
                  onClick={() => handleOptionSelect(index)}
                >
                  {option.text}
                </Option>
              ))}
              <SubmitButton
                onClick={handleSubmit}
                disabled={selectedOption === null || disableSubmit}
              >
                Submit
              </SubmitButton>

              {/* Only show the button if the answer is wrong and submitted */}
              {showFeedback &&
                selectedOption !== correctOption &&
                !showCorrectAnswer && (
                  <CorrectAnswerButton onClick={handleShowCorrectAnswer}>
                    Show Correct Answer
                  </CorrectAnswerButton>
                )}

              {/* Show correct answer after clicking "Go Ahead" */}
              {showCorrectAnswer && (
                <p style={{ color: "green", marginTop: "10px" }}>
                  Correct Answer: {currentQuiz.options[correctOption].text}
                </p>
              )}
            </QuizBox>
          ) : (
            <NoQuestionsMessage>No quiz available at the moment.</NoQuestionsMessage>
          )}
        </ScrollableContent>

        {!noMoreQuizzes && (
          <NextButton onClick={handleNextQuiz} disabled={loading}>
            Next
          </NextButton>
        )}

        {showCorrectAnswerModal && (
          <Modal
            onGoAhead={handleGoAhead}
            onClose={() => setShowCorrectAnswerModal(false)}
          />
        )}
      </QuizContainer>
    </>
  );
}

export default EcosystemPage;
