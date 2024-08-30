import styled from "styled-components";

const Title = styled.h1`
  margin-bottom: 30px;
  text-align: center;
  display: flex;
  align-self: center;
  margin-top: 48px;
  background-color: orange;
  border-radius: 12px;
  padding: 8px;
  font-size: 32px;
  color: black;

  @media (max-width: 576px) {
    font-size: 28px;
    margin-left: 16px;
    margin-right: 16px;
  }
`;

export default Title;
