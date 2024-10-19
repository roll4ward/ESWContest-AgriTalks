import React, { useState } from "react";
import styled from "styled-components";
import { AiFillCheckCircle, AiOutlineDelete } from "react-icons/ai"; // 아이콘 import

// 삭제 확인 모달 컴포넌트
function ConfirmDeleteModal({ onConfirm, onCancel }) {
  return (
    <Overlay onClick={onCancel}>
      <LargeModalContainer onClick={(e) => e.stopPropagation()}>
        <h1 >이미지를 삭제하시겠습니까?</h1>
        <ButtonGroup>
          <ConfirmButton onClick={onConfirm}>예</ConfirmButton>
          <CancelButton onClick={onCancel}>아니요</CancelButton>
        </ButtonGroup>
      </LargeModalContainer>
    </Overlay>
  );
}

export default function ImageModal({ image, onClose, onDelete, onSelect, isSelected }) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false); // 삭제 확인 모달 상태

  const handleDeleteClick = () => {
    setShowConfirmDelete(true); 
  };

  const handleConfirmDelete = () => {
    onDelete(image); // 실제로 이미지를 삭제
    setShowConfirmDelete(false); // 모달 닫기
    onClose(); // 기존 모달 닫기
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false); 
  };

  return (
    <>
      <Overlay onClick={onClose}>
        <ModalContainer onClick={(e) => e.stopPropagation()}>
          <img src={image} alt="선택한 이미지" />
          <ButtonGroup>
            <SelectButton onClick={() => onSelect(image)}>
              <AiFillCheckCircle
                style={{ color: isSelected ? "green" : "gray", marginRight: "8px" }}
                size={40}
              />
              {isSelected ? "선택 해제" : "이미지 선택"}
            </SelectButton>
            <DeleteButton onClick={handleDeleteClick}>
              <AiOutlineDelete style={{ color: "red", marginRight: "8px" }} size={40} />
              이미지 삭제
            </DeleteButton>
          </ButtonGroup>
          <CloseButton onClick={onClose}>X</CloseButton>
        </ModalContainer>
      </Overlay>

     
      {showConfirmDelete && (
        <ConfirmDeleteModal onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />
      )}
    </>
  );
}

// 스타일 정의
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  position: relative;
  max-width: 80%;
  max-height: 80%;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
`;

const LargeModalContainer = styled.div`
  position: relative;
  width: 800px; 
  padding: 40px;  
  background-color: white;
  border-radius: 10px;
  text-align: center;
  max-width: 90%;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 60px;  
`;

const SelectButton = styled.button`
  padding: 30px 60px;  
  background-color: transparent;
  color: black;
  border: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 40px;  
`;

const DeleteButton = styled.button`
  padding: 30px 60px;  
  background-color: transparent;
  color: black;
  border: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 40px;  
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 40px;
  color: white;
  cursor: pointer;
`;

const ConfirmButton = styled.button`
  padding: 20px 50px; 
  font-size: 35px; 
  background-color: #448569;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #367c5b;
  }
`;

const CancelButton = styled.button`
  padding: 20px 50px;  
  font-size: 35px;  
  background-color: #FF6F61;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #ff3b2f;
  }
`;
