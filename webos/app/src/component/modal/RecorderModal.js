import React, { useState, useEffect, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import styled, { keyframes } from "styled-components";
import { startRecord, stopRecord } from "../../api/mediaService";
import { initRecord } from "../../api/mediaService";
import { useRecordStore } from "../../store/useRecordStore";

export default function RecorderModal({ show, handleClose }) {;
  const [seconds, setSeconds] = useState(0);

  const recorderId = useRecordStore((state) => state.recorderId);
  const setRecorderId = useRecordStore((state) => state.setRecorderId);
  const intervalRef = useRef(null); // 타이머 ID를 저장할 ref

  useEffect(() => {
    // recorderId가 없으면 init 하자
    if (!recorderId) {
      initRecord((result) => {
        console.log("New record : ", result);
        setRecorderId(result);
      });
      return;
    }

    if (show) {
      console.log("모달 열림: 녹음 시작");
      startTimer(); // 타이머 시작

      startRecord(recorderId, (result) => {
        if (!result) {
          console.log("녹음 시작 실패");
        }
      });
    } else {
      stopTimer(); // 모달이 닫힐 때 타이머 정지
      setSeconds(0); // 타이머 초기화
    }
  }, [show, recorderId]);

  // 타이머 시작 함수
  const startTimer = () => {
    if (intervalRef.current) return; // 이미 타이머가 작동 중이면 다시 시작하지 않음
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  // 타이머 정지 함수
  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // 타이머 중지
      intervalRef.current = null; // ref 초기화
    }
  };

  // 녹음 중지
  const handleStopRecording = () => {
    stopTimer(); // 타이머 정지

    stopRecord(recorderId, (result) => {
      if (result) {
        setTimeout(()=> {
          handleClose(result);
        }, 100);
      } else {
        console.log("녹음 종료 실패");
        handleClose(null);
      }
    });
  };

  // 녹음 취소
  const handleCancelAudio = () => {
    handleClose(null); // 취소 시 모달을 닫음
    console.log("모달 닫힘: clean-up 처리 중");
    stopRecord(recorderId);
    stopTimer(); // 타이머 정지
    setSeconds(0); // 타이머 초기화
  };

  return (
    <Modal show={show} onHide={handleCancelAudio} centered>
      {/* <Modal.Header closeButton> */}
      <Modal.Header>
        <Modal.Title>녹음하기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <WaveContainer>
          <Wave/>
          <Wave/>
          <Wave/>
        </WaveContainer>

        <Timer>
          {`${Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`}
        </Timer>

        {/* 전송 버튼 */}
        <SendButton
          variant="success"
          onClick={handleStopRecording}
        >
          전송
        </SendButton>

        {/* 취소 버튼 */}
        <ExitButton
          variant="secondary"
          onClick={handleCancelAudio} // 취소 시 모달을 닫음
        >
          취소
        </ExitButton>
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
  animation-play-state: running;
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
  background-color: #ccc;
  cursor: pointer;
`;
