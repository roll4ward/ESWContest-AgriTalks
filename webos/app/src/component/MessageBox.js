import React from "react";
import styled from "styled-components";
import RobotIcon from "../assets/icon/robot.svg";
import NoImage from "../assets/noImage.svg";

export default function MessageBox({ msgType, text, image }) {
  const onErrorImg = (e) => {
    e.target.src = NoImage;
  };

  return (
    <MsgWrap msgType={msgType}>
      {msgType === "ai" && <StyledRobotIcon src={RobotIcon} alt="Robot Icon" />}
      <MsgContent msgType={msgType}>
        <MsgText msgType={msgType}>{text}</MsgText>
        {image && (
          <ImageContainer>
            {image.map((value, idx) => (
              <MsgImage
                key={idx}
                src={value}
                onError={onErrorImg}
                imageCount={image.length} 
              />
            ))}
          </ImageContainer>
        )}
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
  align-items: ${({ msgType }) => (msgType === "user" ? "flex-end" : "flex-start")};
  max-width: 80%;
`;


const MsgText = styled.p`
  background-color: ${({ msgType }) =>
    msgType === "user" ? "#448569" : "#E4E2DE"};
  color: ${({ msgType }) => (msgType === "user" ? "#ffffff" : "#000000")};
  padding: 15px;
  border-radius: 10px;
  max-width: 100%;
  word-break: break-word;
  font-size: 50px; 
  margin-left: ${({ msgType }) => (msgType === "user" ? "0" : "10px")};
  margin-right: ${({ msgType }) => (msgType === "user" ? "10px" : "0")};
  align-self: flex-end; // 텍스트 박스를 오른쪽으로 치우치게 함
`;

// AI 아이콘 스타일
const StyledRobotIcon = styled.img`
  width: 80px;
  height: 80px;
  margin-right: 10px;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 10px;
  gap: 10px; 
`;

const MsgImage = styled.img`
  max-width: ${({ imageCount }) => 100 / imageCount}%; // 이미지 개수에 따라 너비 설정
  border-radius: 10px;
  object-fit: cover;
  background-color: #ffe0b2; // 이미지 주위에 배경색 추가
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); // 부드러운 그림자 효과 추가
`;

