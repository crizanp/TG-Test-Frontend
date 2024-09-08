import styled from "styled-components";

export const QuizContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #0e1621;
  color: white;
  text-align: center;
  font-family: "Arial, sans-serif";
  min-height: 100vh;
  padding-top: 60px;
  position: relative;
`;

export const ScrollableContent = styled.div`
  width: 95%;
  max-width: 600px;
  padding: 20px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    -webkit-overflow-scrolling: touch;
  }
`;

export const QuizBox = styled.div`
  background-color: #1b2b40;
  border-radius: 12px;
  padding: 20px;
  margin: 10px 0;
  transition: transform 0.2s;
  border: 2px solid #13326e; /* Telegram blue tone */
  transform: translateY(0);
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
  }

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

export const QuestionText = styled.h3`
  color: #00aced; /* Lighter telegram blue */
  font-size: 22px;
  margin-bottom: 12px;
  font-weight: 600;
`;

export const Option = styled.div`
  background-color: ${({ $correct, $wrong, $selected, $submitted }) => {
    if (!$submitted) {
      return $selected ? "#375a7f" : "#1b2b40";
    }
    if ($correct) {
      return "#00c851"; /* Green for correct answer */
    }
    if ($wrong) {
      return "#ff3547"; /* Red for incorrect answer */
    }
    return "#1b2b40"; /* Default color */
  }};
  color: white;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: ${({ $isDisabled }) => ($isDisabled ? "not-allowed" : "pointer")};
  pointer-events: ${({ $isDisabled }) => ($isDisabled ? "none" : "auto")};
  border: ${({ $selected }) =>
    $selected ? "2px solid #00aced" : "2px solid transparent"};
  opacity: 0.95;
  transform: ${({ $selected }) => ($selected ? "scale(1.02)" : "scale(1)")};
  transition: transform 0.2s, background-color 0.2s, border 0.2s;

  &:hover {
    background-color: ${({ $selected, $isDisabled }) =>
      $isDisabled ? "#1b2b40" : $selected ? "#2d4566" : "#243b55"};
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 10px;
  }
`;

export const SubmitButton = styled.button`
  background-color: ${({ disabled }) => (disabled ? "grey" : "#0088cc")};
  color: white;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? "grey" : "#00aced")};
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 10px 20px;
  }
`;

export const HeaderText = styled.h2`
  color: #00aced;
  margin-top: 20px;
  font-size: 26px;
  font-weight: 700;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

export const CategoryContainer = styled.div`
  display: flex;
  overflow-x: auto;
  margin: 20px 0;
  padding: 10px 0;
  width: 100%;
  max-width: 600px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const CategoryButton = styled.button`
  background-color: ${({ selected }) => (selected ? "#0088cc" : "#1b2b40")};
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  margin: 0 10px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #00aced;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 8px 12px;
  }
`;

export const NextButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 15px 30px;
  border-radius: 12px;
  font-size: 20px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #66bb6a;
  }

  @media (max-width: 480px) {
    font-size: 16px;
    padding: 10px 20px;
  }
`;

export const NoQuestionsMessage = styled.div`
  color: #ff4d4d;
  font-size: 18px;
  text-align: center;
  margin-top: 20px;
`;
