import React, { useState, useEffect, useCallback } from "react";
import { Button, Modal } from "react-bootstrap";
import styled, { keyframes } from "styled-components";
import { FaStop } from "react-icons/fa";
import { startRecord, stopRecord } from "../../api/mediaService";
import Timer from "../shared/Timer";

const RecorderModal = ({ show, handleClose, recorderId }) => {
  const [rId, setRId] = useState(recorderId);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isSendEnabled, setIsSendEnabled] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);

  const startRecording = useCallback(() => {
    console.log("모달 열림: 녹음 시작");
    setIsRecording(true);
    setResetTimer(false);
    startRecord(rId, (result) => {
      if (!result) console.log("녹음 시작 실패");
    });
  }, [rId]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    setIsSendEnabled(true);
    stopRecord(rId, (result) => {
      if (result) setRecordedAudio(result);
      else console.log("녹음 종료 실패");
    });
  }, [rId]);

  useEffect(() => {
    if (recorderId) setRId(recorderId);
    if (show) startRecording();
    else {
      setIsRecording(false);
      setIsSendEnabled(false);
      setRecordedAudio(null);
      setResetTimer(true);
    }
  }, [show, recorderId, startRecording]);

  const handleStopRecording = () => {
    if (isRecording) stopRecording();
  };

  const handleSendAudio = () => handleClose(recordedAudio || null);

  const handleCancelAudio = () => {
    if (!isSendEnabled) stopRecord(rId,() => {});
    handleClose(null);
  };

  return (
    <Modal show={show} onHide={handleCancelAudio} centered>
      <Modal.Header>
        <Modal.Title>녹음하기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <WaveContainer>
          <Wave isRecording={isRecording} />
          <Wave isRecording={isRecording} />
          <Wave isRecording={isRecording} />
        </WaveContainer>
        <Timer isRunning={isRecording} onReset={resetTimer} />
        <RecordingButton onClick={handleStopRecording} disabled={!isRecording}>
          <FaStop style={{ color: "black" }} />
        </RecordingButton>
        <SendButton
          variant="success"
          onClick={handleSendAudio}
          disabled={!isSendEnabled} // 녹음 중지 후에만 활성화
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
};

const waveAnimation = keyframes`
  0% { transform: scaleY(1); }
  50% { transform: scaleY(1.5); }
  100% { transform: scaleY(1); }
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
  animation-play-state: ${({ isRecording }) => isRecording ? "running" : "paused"};
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.4s; }
`;

const RecordingButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid gray;
  background-color: white;
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
  background-color: #ccc;
  cursor: pointer;
`;

export default RecorderModal;