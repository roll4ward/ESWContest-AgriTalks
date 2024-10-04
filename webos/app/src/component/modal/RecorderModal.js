import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import styled, { keyframes } from "styled-components";
import { FaMicrophone, FaStop } from "react-icons/fa";
export default function RecorderModal({ show, handleClose }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isRecording && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording, seconds]);
  useEffect(() => {
    // 모달이 열릴 때마다 상태 초기화
    if (show) {
      setIsRecording(false);
      setRecordedAudio(null);
      setSeconds(0);
    }
  }, [show]);
  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setRecordedAudio("dummy-audio-file");
    } else {
      setSeconds(0);
      setRecordedAudio(null);
      setIsRecording(true);
    }
  };
  const handleSendAudio = () => {
    if (recordedAudio) {
      handleClose();
    }
  };
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>녹음하기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isRecording && (
          <WaveContainer>
            <Wave />
            <Wave />
            <Wave />
          </WaveContainer>
        )}
        {(isRecording || seconds > 0) && (
          <Timer>
            {`${Math.floor(seconds / 60)
              .toString()
              .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`}
          </Timer>
        )}
        <RecordingButton
          onClick={handleToggleRecording}
          recording={isRecording}
        >
          {isRecording ? (
            <FaStop style={{ color: "black" }} />
          ) : (
            <FaMicrophone style={{ color: "red" }} />
          )}
        </RecordingButton>
        <SendButton
          variant="success"
          onClick={handleSendAudio}
          disabled={!recordedAudio}
        >
          전송
        </SendButton>
      </Modal.Body>
    </Modal>
  );
}
const waveAnimation = keyframes`
  0% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.5);
  }
  100% {
    transform: scaleY(1);
  }
`;
const WaveContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 20px 0;
  height: 60px;
`;
const Wave = styled.div`
  width: 5px;
  height: 100%;
  background-color: #007bff;
  border-radius: 50px;
  animation: ${waveAnimation} 0.6s infinite ease-in-out;
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
`;
const Timer = styled.div`
  font-size: 1.5rem;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 20px;
`;
const RecordingButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid ${({ recording }) => (recording ? "gray" : "gray")};
  background-color: ${({ recording }) => (recording ? "white" : "white")};
  cursor: pointer;
  margin: 20px auto;
`;
const SendButton = styled(Button)`
  width: 100%;
  margin-top: 20px;
  background-color: ${({ disabled }) => (disabled ? "#ccc" : "#448569")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;