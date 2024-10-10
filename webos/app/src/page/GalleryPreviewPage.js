import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { readAllImages } from "../api/mediaService";

export default function GalleryPreviewPage() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // 선택한 이미지
  const navigate = useNavigate();

  useEffect( () => {
    readAllImages((result)=> {
      if(result){
        setImages(result);
      }else{
        console.log("저장된 이미지 없음");
      }
    });
  }, []);

  const handleImageSelect = (imagePath) => {
    setSelectedImage(imagePath); // 선택된 이미지 경로 저장
  };

  const handleCompleteSelection = () => {
    if (selectedImage) {
      navigate("/chat", { state: { selectedImage } });
    } else {
      alert("이미지를 선택하세요!");
    }
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
            selected={selectedImage === image} // 선택 여부에 따라 스타일 변경
          >
            <img
              src={`${image}`}
              alt={image}
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
              }}
            />
            <p>{image}</p>
          </ImageItem>
        ))}
      </GalleryGrid>
      <Button onClick={handleCompleteSelection}>선택 완료</Button>
    </Container>
  );
}

// 스타일 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GalleryGrid = styled.div`
  display: flex;
  grid-template-columns: repeat(
    auto-fill,
    minmax(150px, 1fr)
  ); /* 그리드 조정 */
  gap: 20px;
  margin: 20px;
  justify-items: center; /* 중앙 정렬 */
  flex-wrap: wrap;
`;

const ImageItem = styled.div`
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
