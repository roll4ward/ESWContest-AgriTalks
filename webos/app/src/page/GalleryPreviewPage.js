import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { readAllImages } from "../api/mediaService";

import AIQueryModal from "../component/modal/AIQueryModal";
import { createToast } from "../api/toast"; // WebOS createToast import
export default function GalleryPreviewPage() {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    readAllImages((result) => {
      if (result) {
        setImages(result);
      } else {
        console.log("저장된 이미지 없음");
      }
    });
  }, []);

  // 이미지 선택 처리 함수
  const handleImageSelect = (imagePath) => {
    if (selectedImages.includes(imagePath)) {
      // 이미 선택된 이미지면 선택 해제
      setSelectedImages(selectedImages.filter((img) => img !== imagePath));
    } else if (selectedImages.length < 3) {
      // 선택된 이미지가 3개 미만일 때 추가
      setSelectedImages([...selectedImages, imagePath]);
    } else {
      // 3개를 초과한 경우 WebOS의 Toast 메시지 호출
      createToast("이미지는 최대 3개까지만 선택할 수 있습니다.");
    }
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
    setIsModalOpen(false); // 모달 닫기
  };

  const handleModalSend = (description) => {
    navigate("/chat", {
      state: { selectedImages, selectedImageDesc: description },
    });
    setIsModalOpen(false);
  };


  return (
    <Container>
      <h1>이미지 미리보기</h1>
      <GalleryGrid>
        {images.length === 0 && <p>이미지를 불러오는 중...</p>}
        {images.map((image) => (
          <ImageItem
            key={image}
            onClick={() => handleImageSelect(image)} 
            selected={selectedImages.includes(image)} 
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
          </ImageItem>
        ))}
      </GalleryGrid>
      <Button onClick={handleCompleteSelection}>AI에게 물어보기</Button>

    
      {isModalOpen && (
        <AIQueryModal
          selectedImages={selectedImages} // 선택한 이미지 배열을 모달로 전달
          onClose={handleModalClose}
          onSend={handleModalSend}
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
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 20px;
  justify-items: center; 
`;

const ImageItem = styled.div`
  width: 320px; /* 이미지 비율 640x480의 절반 */
  height: 240px; /* 이미지 비율 640x480의 절반 */
  cursor: pointer;
  text-align: center;
  padding: 10px;
  border: ${(props) => (props.selected ? "5px solid blue" : "2px solid #ccc")};
  border-radius: 10px;
  transition: border 0.3s ease;

  &:hover {
    border: ${(props) =>
      props.selected ? "5px solid blue" : "2px solid #888"};
  }
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #448569;
  color: #fff;
  border: none;
  cursor: pointer;
`;