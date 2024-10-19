import React from "react";
import styled from "styled-components";
import { AiFillCheckCircle, AiOutlineDelete } from "react-icons/ai"; // 아이콘 import

export default function ImageModal({ image, onClose, onDelete, onSelect, isSelected }) {
  return (
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
          <DeleteButton onClick={() => onDelete(image)}>
            <AiOutlineDelete style={{ color: "red", marginRight: "8px" }} size={40} /> 
            이미지 삭제
          </DeleteButton>
        </ButtonGroup>
        <CloseButton onClick={onClose}>X</CloseButton>
      </ModalContainer>
    </Overlay>
  );
}

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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const SelectButton = styled.button`
  padding: 20px 40px;  /* 버튼 크기를 키우기 위한 패딩 값 조정 */
  background-color: transparent;
  color: black;
  border: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 30px;  /* 폰트 크기를 키움 */
`;

const DeleteButton = styled.button`
  padding: 20px 40px;  /* 버튼 크기를 키우기 위한 패딩 값 조정 */
  background-color: transparent;
  color: black;
  border: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 30px;  /* 폰트 크기를 키움 */
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
`;
