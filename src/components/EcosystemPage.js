import React, { useState, useEffect } from "react";
import axios from "axios";
import { usePoints } from "../context/PointsContext";
import UserInfo from "./UserInfo";
import dollarImage from "../assets/dollar-homepage.png";
import styled from "styled-components";
import FloatingMessage from "./FloatingMessage";

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
const PointsDisplayContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 35px;
`;

const PointsDisplay = styled.div`
  font-size: 50px;
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DollarIcon = styled.img`
  width: 48px;
  height: 48px;
  margin-right: 10px;
`;

function EcosystemPage() {
  const { points, setPoints, userID } = usePoints();
  const [categories, setCategories] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("random");
  const [loading, setLoading] = useState(true);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [correctOption, setCorrectOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [noMoreQuizzes, setNoMoreQuizzes] = useState(false);
  const [message, setMessage] = useState(null);

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
  // Fetch remaining quizzes when userID or selectedCategory changes
useEffect(() => {
  const fetchRemainingQuizzes = async () => {
    try {
      let url = `${process.env.REACT_APP_API_URL}/user-info/${userID}/remaining-quizzes`;

      // If category is "random", use the specific URL
      if (selectedCategory === "Random") {
        url = `${process.env.REACT_APP_API_URL}/user-info/${userID}/remaining-quizzes`;
      } else {
        url += `?category=${selectedCategory}`;
      }

      const response = await axios.get(url);

      console.log("API Response:", response.data);

      if (!response.data || response.data.message === 'No remaining quizzes found') {
        setCurrentQuiz(null);
        setNoMoreQuizzes(true);
      } else {
        setCurrentQuiz(response.data[0]); // Set the first quiz from the response
        setNoMoreQuizzes(false);
      }

      setLoading(false);
      setSelectedOption(null);
      setDisableSubmit(false);
      setCorrectOption(null);
      setShowFeedback(false);
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
    if (selectedOption === null || alreadyCompleted) return;

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

      setMessage({
        text: isCorrect
          ? "Points awarded: Correct answer"
          : "Points not added: Wrong answer",
        type: isCorrect ? "success" : "error",
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const handleNextQuiz = async () => {
    setLoading(true);
  
    try {
      let url = `${process.env.REACT_APP_API_URL}/user-info/${userID}/remaining-quizzes`;
  
      // If category is "random", use the specific URL
      if (selectedCategory === "Random") {
        url = `${process.env.REACT_APP_API_URL}/user-info/${userID}/remaining-quizzes`;
      } else {
        url += `?category=${selectedCategory}`;
      }
  
      const response = await axios.get(url);
  
      console.log("Next Quiz API Response:", response.data);
  
      if (!response.data || response.data.message === 'No remaining quizzes found') {
        setCurrentQuiz(null);
        setNoMoreQuizzes(true);
      } else {
        setCurrentQuiz(response.data[0]);
        setSelectedOption(null);
        setDisableSubmit(false);
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
    <QuizContainer>
      <UserInfo />
      <HeaderText>Answer and Earn</HeaderText>

      <CategoryContainer>
        {categories.map((category) => (
          <CategoryButton
            key={category._id}
            selected={category.name === selectedCategory}
            onClick={() => {
              console.log("Category selected:", category.name); // Log selected category
              setSelectedCategory(category.name); // Use category name instead of ID
            }}
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
                  showFeedback && index === selectedOption && !option.isCorrect
                }
                $isDisabled={disableSubmit}
                onClick={() => handleOptionSelect(index)}
              >
                {option.text}
              </Option>
            ))}
            <SubmitButton
              onClick={handleSubmit}
              disabled={
                selectedOption === null || alreadyCompleted || disableSubmit
              }
            >
              {alreadyCompleted ? "Quiz Completed" : "Submit"}
            </SubmitButton>
          </QuizBox>
        ) : (
          <NoQuestionsMessage>
            No quiz available at the moment.
          </NoQuestionsMessage>
        )}
      </ScrollableContent>

      {!noMoreQuizzes && (
        <NextButton onClick={handleNextQuiz} disabled={loading}>
          Next
        </NextButton>
      )}

      {message && (
        <FloatingMessage
          message={message.text}
          type={message.type}
          duration={3000}
          onClose={() => setMessage(null)}
        />
      )}
    </QuizContainer>
  );
}

export default EcosystemPage;
