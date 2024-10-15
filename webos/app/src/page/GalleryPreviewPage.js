import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { readAllImages, deleteImage } from "../api/mediaService";
import { AiFillCheckCircle } from "react-icons/ai"; 
import AIQueryModal from "../component/modal/AIQueryModal";
import ImageModal from "../component/modal/ImageModal"; 
import { createToast } from "../api/toast"; 

export default function GalleryPreviewPage() {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // 이미지 모달 상태 추가
  const [modalImage, setModalImage] = useState(null); // 모달에 띄울 이미지 상태
  const navigate = useNavigate();
  const longPressTimer = useRef(null); // LongPress 타이머 저장

  useEffect(() => {
    readAllImages((result) => {
      if (result) {
        setImages(result);
      } else {
        console.log("저장된 이미지 없음");
      }
    });
  }, []);

  // LongPress 감지 함수
  const handleMouseDown = (image) => {
    longPressTimer.current = setTimeout(() => {
      handleImageSelect(image); // LongPress 시 이미지 선택 처리
    }, 500); // 500ms 동안 누르고 있으면 LongPress로 간주
  };

  const handleMouseUp = () => {
    clearTimeout(longPressTimer.current); // LongPress 타이머 초기화
  };

  const handleClick = (image) => {
    clearTimeout(longPressTimer.current);
    setModalImage(image);
    setIsImageModalOpen(true); // 클릭 시 모달 열기
  };

  // 이미지 선택 처리 함수 (LongPress 시 호출)
  const handleImageSelect = (imagePath) => {
    if (selectedImages.includes(imagePath)) {
      setSelectedImages(selectedImages.filter((img) => img !== imagePath));
    } else if (selectedImages.length < 3) {
      setSelectedImages([...selectedImages, imagePath]);
    } else {
      createToast("이미지는 최대 3개까지만 선택할 수 있습니다.");
    }
  };


  const handleImageDelete = (imagePath) => {
    setImages(images.filter((img) => img !== imagePath)); 
    setSelectedImages(selectedImages.filter((img) => img !== imagePath)); 
    setIsImageModalOpen(false); // 모달 닫기
    deleteImage(imagePath, () =>{
      console.log("이미지 삭제 완료");
    });
    createToast("이미지가 삭제되었습니다.");
  };

  // 이미지 모달에서 선택 처리
  const handleImageSelectInModal = (imagePath) => {
    handleImageSelect(imagePath);
    createToast(
      selectedImages.includes(imagePath)
        ? "이미지 선택 해제"
        : "이미지가 선택되었습니다."
    );
  };

  const handleCompleteSelection = () => {
    if (selectedImages.length > 3) {
      createToast("이미지는 최대 3장까지만 선택할 수 있습니다.");
    } else if (selectedImages.length > 0) {
      setIsModalOpen(true);
    } else {
      createToast("이미지를 선택하세요!");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false); 
  };

  const handleModalSend = (description) => {
    navigate("/chat", {
      state: { selectedImages, selectedImageDesc: description },
    });
    setIsModalOpen(false);
  };

  const handleImageModalClose = () => {
    setIsImageModalOpen(false); 
  };

  return (
    <Container>
      <h1>이미지 미리보기</h1>
      <GalleryGrid>
        {images.length === 0 && <p>이미지를 불러오는 중...</p>}
        {images.map((image) => (
          <ImageItem
            key={image}
            onMouseDown={() => handleMouseDown(image)} 
            onMouseUp={handleMouseUp} 
            onClick={() => handleClick(image)} 
            onTouchStart={() => handleMouseDown(image)} 
            onTouchEnd={handleMouseUp} 
          >
            <img
              src={`${image}`}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {selectedImages.includes(image) && (
              <SelectedIcon>
                <AiFillCheckCircle size={32} color="green" />
              </SelectedIcon>
            )}
          </ImageItem>
        ))}
      </GalleryGrid>
      <Button onClick={handleCompleteSelection}>AI에게 물어보기</Button>

      {isModalOpen && (
        <ModalOverlay>
          <AIQueryModal
            selectedImages={selectedImages} 
            onClose={handleModalClose}
            onSend={handleModalSend}
          />
        </ModalOverlay>
      )}

      {isImageModalOpen && (
        <ImageModal
          image={modalImage}
          onClose={handleImageModalClose}
          onDelete={handleImageDelete}
          onSelect={handleImageSelectInModal}
          isSelected={selectedImages.includes(modalImage)} 
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GalleryGrid = styled.div`
  display: grid;
  height: 80vh;
  overflow-y: scroll;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 20px;
  justify-items: center;
`;

const ImageItem = styled.div`
  position: relative;
  width: 320px; /* 이미지 비율 640x480의 절반 */
  height: 240px; /* 이미지 비율 640x480의 절반 */
  cursor: pointer;
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  transition: border 0.3s ease;
`;

const SelectedIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #448569;
  color: #fff;
  border: none;
  cursor: pointer;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6); 
  z-index: 1000; 
  display: flex;
  justify-content: center;
  align-items: center;
`;
