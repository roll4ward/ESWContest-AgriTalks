import React, { useState } from "react";
import styled from "styled-components";

export default function AIQueryModal({ selectedImages, onClose, onSend }) {
  const [description, setDescription] = useState("");

  const handleSend = () => {
    if (description.trim()) {
      onSend(description);
    } else {
      alert("설명을 입력하세요!");
    }
  };

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

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

const ImagePreviewContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const ImageItem = styled.img`
  width: 300px;
  height: 225px;
  object-fit: cover;
  border-radius: 5px;
  border: 2px solid #ccc;
`;

const Input = styled.textarea`
  width: 100%;
  height: 150px;
  padding: 15px;
  margin-bottom: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 18px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Button = styled.button`
  padding: 15px 30px;
  font-size: 18px;
  background-color: ${(props) => (props.cancel ? "#FF6F61" : "#448569")};
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: ${(props) => (props.cancel ? "#ff3b2f" : "#367c5b")};
  }
`;
