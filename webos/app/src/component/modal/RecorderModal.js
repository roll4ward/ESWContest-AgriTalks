import React, { useState, useEffect, useCallback } from "react";
import { Button, Modal } from "react-bootstrap";
import styled, { keyframes } from "styled-components";
import { startRecord, stopRecord } from "../../api/mediaService";
import { useTimer } from "../shared/useTimer";

export default function RecorderModal({ show, handleClose }) {
  const [recorderId, setRecorderId] = useState(null);
  const seconds = useTimer(show);

  useEffect(() => {
    if (show) {
      startRecord((result) => {
        setRecorderId(result);
      });
    }
  }, [show]);

  const handleSendAudio = useCallback(() => {
    stopRecord(recorderId, (result)=> {
      handleClose(result);
      setRecorderId(null);
    });
  }, [recorderId, handleClose]);

  const handleCancelAudio = useCallback(() => {
    stopRecord(recorderId, (result)=> {
      handleClose(null);
      setRecorderId(null);
    });
  }, [recorderId, handleClose]);

  return (
    <Modal show={show} onHide={handleCancelAudio} centered>
      <Modal.Header>
        <Modal.Title>녹음하기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <WaveContainer>
          <Wave />
          <Wave />
          <Wave />
        </WaveContainer>

        <Timer>
          {`${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`}
        </Timer>

        <ButtonContainer>
          <SendButton onClick={handleSendAudio}>전송</SendButton>
          <ExitButton onClick={handleCancelAudio}>취소</ExitButton>
        </ButtonContainer>
      </Modal.Body>
    </Modal>
  );
}

const waveAnimation = keyframes`
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.5); }
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
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.4s; }
`;

const Timer = styled.div`
  font-size: 1.5rem;
  text-align: center;
  margin: 10px 0 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const StyledButton = styled(Button)`
  width: 47%;
`;

const SendButton = styled(StyledButton)`
  background-color: #448569;
`;

const ExitButton = styled(StyledButton)`
  background-color: #ccc;
`;