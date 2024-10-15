import React from "react";
import styled from "styled-components";
import RobotIcon from "../assets/icon/robot.svg";

export default function MessageBox({ msgType, text, image }) {
  return (
    <MsgWrap msgType={msgType}>
      {msgType === "ai" && <StyledRobotIcon src={RobotIcon} alt="Robot Icon" />}
      <MsgContent>
        <MsgText msgType={msgType}>{text}</MsgText>
        {/* {image && <MsgImage src={image} alt="Prompt Image" />} */}
        {image && image.map((value, idx) => (
             <MsgImage src={value} alt="Prompt Image" />
        ))}
      </MsgContent>
    </MsgWrap>
  );
}

// 메세지 박스 레이아웃 설정
const MsgWrap = styled.div`
  display: flex;
  justify-content: ${({ msgType }) =>
    msgType === "user" ? "flex-end" : "flex-start"};
  align-items: flex-start;
  margin: 50px;
`;

const MsgContent = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 80%;
`;

// 텍스트 말풍선 스타일
const MsgText = styled.p`
  background-color: ${({ msgType }) =>
    msgType === "user" ? "#448569" : "#E4E2DE"};
  color: ${({ msgType }) => (msgType === "user" ? "#ffffff" : "#000000")};
  padding: 15px;
  border-radius: 10px;
  max-width: 100%;
  word-break: break-word;
  font-size: 50px; // 폰트 크기 조정
  margin-left: ${({ msgType }) => (msgType === "user" ? "0" : "10px")};
  margin-right: ${({ msgType }) => (msgType === "user" ? "10px" : "0")};
`;

// AI 아이콘 스타일
const StyledRobotIcon = styled.img`
  width: 80px;
  height: 80px;
  margin-right: 10px;
`;

// 이미지 스타일 추가
const MsgImage = styled.img`
  margin-top: 10px;
  max-width: 100%; // 이미지를 텍스트와 같은 너비로 맞춤
  border-radius: 10px;
  object-fit: cover;
  border: 3px solid #ff5722; // 눈에 띄는 테두리 색상 추가
  background-color: #ffe0b2; // 이미지 주위에 배경색 추가
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); // 부드러운 그림자 효과 추가
`;