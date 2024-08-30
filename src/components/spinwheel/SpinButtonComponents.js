import styled from "styled-components";

const SpinButtonContainer = styled.div`
  width: 80px;
  height: 80px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -40px 0 0 -40px;
  border-radius: 50%;
  box-shadow: rgba(255, 255, 255, 0.1) 0px 3px 0px;
  z-index: 100;
  background: #fff;
  cursor: pointer;
  user-select: none;

  &::before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 20px 28px 20px;
    border-color: transparent transparent #ffffff transparent;
    top: -20px;
    left: 20.5px;

    @media (max-width: 576px) {
      border-width: 0 15px 20px 15px;
      top: -11px;
      left: 13.5px;
    }
  }

  @media (max-width: 576px) {
    width: 60px;
    height: 60px;
    margin: -30px 0 0 -30px;
  }
`;

const SpinButton = styled.button`
  width: 70px;
  height: 70px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -35px 0 0 -35px;
  border-radius: 50%;
  background: black;
  z-index: 9;
  box-shadow: rgba(255, 255, 255, 1) 0px -2px 0px inset,
    rgba(255, 255, 255, 1) 0px 2px 0px inset, rgba(0, 0, 0, 0.4) 0px 0px 5px;
  border: none;
  cursor: pointer;

  &:active {
    box-shadow: rgba(255, 255, 255, 0.4) 0px 0px 5px inset;
  }

  @media (max-width: 576px) {
    width: 54px;
    height: 54px;
    margin: -27px 0 0 -27px;
  }
`;

const SpinButtonText = styled.div`
  position: relative;
  text-align: center;
  font-size: 16px;
  letter-spacing: 0.1em;
  line-height: 70px;
  color: white;
  z-index: 1000;

  @media (max-width: 576px) {
    font-size: 14px;
    line-height: 60px;
  }
`;

export { SpinButtonContainer, SpinButton, SpinButtonText };
