import styled from 'styled-components';

export const QuizContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1c1c1c;
  color: white;
  text-align: center;
  font-family: 'Arial, sans-serif';
  min-height: 100vh;
  padding-top: 70px;
  position: relative;
  overflow: hidden;
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
  background-color: #252525;
  border-radius: 15px;
  padding: 20px;
  margin: 10px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.8);
  }

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

export const QuestionText = styled.h3`
  color: #ff9800;
  font-size: 20px;
  margin-bottom: 10px;
`;

export const Option = styled.div`
  background-color: ${({ $correct, $wrong, $selected, $submitted }) => {
    if (!$submitted) {
      return $selected ? '#444' : '#252525';
    }
    if ($correct) {
      return '#4caf50'; // Green for correct answer
    }
    if ($wrong) {
      return '#ff4d4d'; // Red for incorrect answer
    }
    return '#252525'; // Default color
  }};
  color: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
  pointer-events: ${({ $isDisabled }) => ($isDisabled ? 'none' : 'auto')};
  box-shadow: ${({ $selected }) => ($selected ? '0 0 10px rgba(0, 0, 0, 0.7)' : '0 2px 4px rgba(0, 0, 0, 0.5)')};
  opacity: ${({ $selected }) => ($selected ? '1' : '0.9')};
  transform: ${({ $selected }) => ($selected ? 'scale(1.02)' : 'scale(1)')};
  border: 1px solid ${({ $selected }) => ($selected ? '#ff9800' : 'transparent')};

  &:hover {
    background-color: ${({ $selected, $isDisabled }) =>
      $isDisabled ? '#252525' : $selected ? '#555' : '#333'};
  }

  &:not(:last-child) {
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 12px;
  }
`;




export const SubmitButton = styled.button`
  background-color: ${({ disabled }) => (disabled ? 'grey' : '#ff9800')};
  color: white;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? 'grey' : '#ffb74d')};
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 8px 16px;
  }
`;

export const HeaderText = styled.h2`
  color: #ff9800;
  margin-top: 20px;
  font-size: 24px;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 20px;
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
  background-color: ${({ selected }) => (selected ? '#4caf50' : '#252525')};
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  margin: 0 10px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4caf50;
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
