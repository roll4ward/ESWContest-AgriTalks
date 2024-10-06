import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import styled, { keyframes } from "styled-components";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { startRecord, pauseRecord, resumeRecord, stopRecord } from "../../api/mediaService";
export default function RecorderModal({ show, handleClose, recorderId }) {
  const [rId, setRId] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
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
    // 래코드 id 저장
    if(recorderId) setRId(recorderId);
    // 모달이 열릴 때마다 상태 초기화
    if (show) {
      setIsRecording(false);
      setRecordedAudio(null);
      setSeconds(0);
    }
  }, [show, recorderId]);
  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // stopRecord(rId, (result)=> {
      //   if(result){
      //     setRecordedAudio(result);
      //   }else{
      //     console.log("녹음 종료 실패");
      //   }
      // });

    } else {
      setSeconds(0);
      // startRecord(rId, (result)=> {
      //   if(!result){
      //     console.log("녹음 시작 실패");
      //   }
      // });
      setIsRecording(true);
    }
  };
  const handleSendAudio = () => {
    if (recordedAudio) {
      handleClose(recordedAudio);
    }else{
      handleClose(null);
    }
  };
  return (
    <Modal show={show} onHide={handleClose} centered>
      {/* <Modal.Header closeButton> */}
      <Modal.Header>
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
        <FaStop style={{ color: "black" }} />
        </RecordingButton>
        <SendButton variant="success" onClick={handleSendAudio} disabled={!recordedAudio}> 전송 </SendButton>
        <ExitButton variant="secondary" onClick={handleSendAudio} disabled={!recordedAudio}> 취소 </ExitButton>
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
  width: 47%;
  margin-top: 20px;
  margin-right: 10px;
  background-color: ${({ disabled }) => (disabled ? "#ccc" : "#448569")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

const ExitButton = styled(Button)`
  width: 47%;
  margin-top: 20px;
  margin-left: 10px;
  background-color: ${({ disabled }) => (disabled ? "#ccc" : "#448569")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;