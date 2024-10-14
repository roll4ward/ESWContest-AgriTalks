// import React, { useState, useEffect, useRef } from "react";
// import { Button, Modal } from "react-bootstrap";
// import styled, { keyframes } from "styled-components";
// import { startRecord, stopRecord } from "../../api/mediaService";

// export default function RecorderModal({ show, handleClose }) {
//   const [recorderId, setRecorderId] = useState(false);
//   const [seconds, setSeconds] = useState(0);
//   const intervalRef = useRef(null); // 타이머 ID를 저장할 ref
//   useEffect(() => {
//     if (show) {
//       startTimer();
//       startRecord((result) => {
//         setRecorderId(result);
//       });
//     } else {
//       stopTimer(); // 모달이 닫힐 때 타이머 정지
//       setSeconds(0); // 타이머 초기화
//     }
//   }, [show]);

//   // 타이머 시작 함수
//   const startTimer = () => {
//     if (intervalRef.current) return; // 이미 타이머가 작동 중이면 다시 시작하지 않음
//     intervalRef.current = setInterval(() => {
//       setSeconds((prev) => prev + 1);
//     }, 1000);
//   };

//   // 타이머 정지 함수
//   const stopTimer = () => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current); // 타이머 중지
//       intervalRef.current = null; // ref 초기화
//     }
//   };

//   // 오디오 전송
//   const handleSendAudio = () => {
//     stopRecord(recorderId, (result)=> {
//       handleClose(result);
//     });
//   };

//   // 녹음 취소
//   const handleCancelAudio = () => {
//     stopRecord(recorderId, (result)=> {
//       handleClose(null);
//     });
//   };

//   return (
//     <Modal show={show} onHide={handleCancelAudio} centered>
//       {/* <Modal.Header closeButton> */}
//       <Modal.Header>
//         <Modal.Title>녹음하기</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//           <WaveContainer>
//             <Wave />
//             <Wave />
//             <Wave />
//           </WaveContainer>

//         <Timer>
//           {`${Math.floor(seconds / 60)
//             .toString()
//             .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`}
//         </Timer>

//         {/* 전송 버튼 */}
//         <SendButton
//           variant="success"
//           onClick={handleSendAudio}
//         >
//           전송
//         </SendButton>

//         {/* 취소 버튼 */}
//         <ExitButton
//           variant="secondary"
//           onClick={handleCancelAudio} // 취소 시 모달을 닫음
//         >
//           취소
//         </ExitButton>
//       </Modal.Body>
//     </Modal>
//   );
// }

// const waveAnimation = keyframes`
//   0% {
//     transform: scaleY(1);
//   }
//   50% {
//     transform: scaleY(1.5);
//   }
//   100% {
//     transform: scaleY(1);
//   }
// `;

// const WaveContainer = styled.div`
//   display: flex;
//   justify-content: space-around;
//   align-items: center;
//   margin: 20px 0;
//   height: 60px;
// `;

// const Wave = styled.div`
//   width: 5px;
//   height: 100%;
//   background-color: #007bff;
//   border-radius: 50px;
//   animation: ${waveAnimation} 0.6s infinite ease-in-out;
//   animation-play-state: "running"
//   &:nth-child(2) {
//     animation-delay: 0.2s;
//   }
//   &:nth-child(3) {
//     animation-delay: 0.4s;
//   }
// `;

// const Timer = styled.div`
//   font-size: 1.5rem;
//   text-align: center;
//   margin-top: 10px;
//   margin-bottom: 20px;
// `;

// const SendButton = styled(Button)`
//   width: 47%;
//   margin-top: 20px;
//   margin-right: 10px;
//   background-color: ${({ disabled }) => (disabled ? "#ccc" : "#448569")};
//   cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
// `;

// const ExitButton = styled(Button)`
//   width: 47%;
//   margin-top: 20px;
//   margin-left: 10px;
//   background-color: #ccc;
//   cursor: pointer;
// `;


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