import styled from "styled-components";

const ActionButton = styled.a`
  display: inline-block;
  background-color: #1da1f2;
  color: white;
  text-decoration: none;
  padding: 15px 30px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
  transition: background-color 0.3s;
  text-align: center;

  &:hover {
    background-color: #1a91da;
  }
`;

export default ActionButton;
