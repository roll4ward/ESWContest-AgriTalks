import React, { useState } from "react";
import styled from "styled-components";
import { FaMicrophone } from "react-icons/fa";
import RecorderModal from "./RecorderModal";
import { STT } from "../../api/aiService";

export default function AIQueryModal({ selectedImages, onClose, onSend }) {
  const [description, setDescription] = useState("");
  const [showRecordModal, setShowRecordModal] = useState(false);

  const handleSend = () => {
    if (description.trim()) {
      onSend(description);
    } else {
      alert("설명을 입력하세요!");
    }
  };

  const handleRecordModalClose = (audio) => {
    setShowRecordModal(false);
    console.log(audio);
    if (!audio) return;

    STT(audio, (result) => {
      onSend(result);
    });
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <Title>AI에게 물어보기</Title>

        <ImagePreviewContainer>
          {selectedImages.map((image, index) => (
            <ImageItem
              key={index}
              src={`file://${image}`}
              alt={`Selected ${index + 1}`}
            />
          ))}
        </ImagePreviewContainer>

        <RecordingButton onClick={()=> { setShowRecordModal(true); }}>
          <FaMicrophone style={{ color: "black" }} />
        </RecordingButton>

        <Input
          placeholder="이미지에 대해 AI에게 물어볼 내용을 입력하세요."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <ButtonContainer>
          <Button onClick={handleSend}>전송</Button>
          <Button onClick={onClose} cancel>
            취소
          </Button>
        </ButtonContainer>
      </ModalContent>
      <RecorderModal
        show={showRecordModal}
        handleClose={handleRecordModalClose}
      />
    </ModalOverlay>
  );
}

// 스타일 정의
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  width: 900px;
  height: auto;
  max-height: 90vh;
  text-align: center;
  overflow-y: auto;
`;

const Title = styled.h1`
  font-size: 50px;  
  margin-bottom: 30px;  /* 간격 확대 */
`;

const ImagePreviewContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
`;

const ImageItem = styled.img`
  width: 350px;  /* 이미지 크기 확대 */
  height: 250px;  /* 이미지 크기 확대 */
  object-fit: cover;
  border-radius: 5px;
  border: 2px solid #ccc;
`;

const Input = styled.textarea`
  width: 100%;
  height: 350px;  
  padding: 20px;  
  margin-bottom: 40px; 
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 38px;  
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Button = styled.button`
  padding: 20px 40px;  /* 버튼 크기 확대 */
  font-size: 40px;  /* 버튼 텍스트 크기 확대 */
  background-color: ${(props) => (props.cancel ? "#FF6F61" : "#448569")};
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  width: 170px;  /* 버튼 넓이 설정 */

  &:hover {
    background-color: ${(props) => (props.cancel ? "#ff3b2f" : "#367c5b")};
  }
`;

const RecordingButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 3px solid gray;
  background-color: white;
  cursor: pointer;
  margin: 20px auto;
`;