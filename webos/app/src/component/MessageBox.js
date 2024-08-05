import React from "react";
import styled from "styled-components";
import RobotIcon from "../icon/robot.svg";

export default function MessageBox({ msgType, text }) {
  return (
    <MsgWrap msgType={msgType}>
      {msgType === "ai" && <StyledRobotIcon src={RobotIcon} alt="Robot Icon" />}
      <MsgText msgType={msgType}>{text}</MsgText>
    </MsgWrap>
  );
}

const MsgWrap = styled.div`
  display: flex;
  justify-content: ${({ msgType }) =>
    msgType === "user" ? "flex-end" : "flex-start"};
  align-items: center;
  margin: 50px;
`;

const MsgText = styled.p`
  background-color: ${({ msgType }) =>
    msgType === "user" ? "#448569" : "#E4E2DE"};
  color: ${({ msgType }) => (msgType === "user" ? "#ffffff" : "#000000")};
  padding: 15px;
  border-radius: 10px;
  max-width: 60%;
  word-break: break-word;
  font-size: 1.3rem;
  margin-left: ${({ msgType }) => (msgType === "user" ? "0" : "10px")};
  margin-right: ${({ msgType }) => (msgType === "user" ? "10px" : "0")};
`;

const StyledRobotIcon = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;
