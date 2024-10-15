import styled from "styled-components";
import arrowRight from "../assets/icon/arrowLeft.png";
import { useLocation, useNavigate } from "react-router-dom";
import home from "./../assets/icon/home.png";
import chat from "./../assets/icon/chat.png";
import image from "./../assets/icon/image.png";
import cameraIcon from "./../assets/icon/cameraIcon.svg";
import { useEffect, useState } from "react";

export const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuIndex, setMenuIndex] = useState(0);
  useEffect(() => {
    switch(location.pathname.split("/")[1]) {
      case "":
      case "devices":
      case "detail":
        setMenuIndex(0);
        break;
      case "chat":
        setMenuIndex(1);
        break;
      case "camera":
        setMenuIndex(2);
        break;
      case "gallery":
        setMenuIndex(3);
        break;
    }
  }, [location.pathname]);

  return (
    <Container>
      <MeunContainer>
        {/* 대시보드 */}
        <ImgContainer
          onClick={() => {
            navigate("/");
          }}
          style={{
            backgroundColor:
              menuIndex === 0 ? "rgba(90, 166, 131, 0.4)" : "transparent",
          }}
        >
          <img src={home} width={70} height={60} alt="" />
        </ImgContainer>

        {/* AI 채팅 */}
        <ImgContainer
          onClick={() => {
            navigate("/chat");
          }}
          style={{
            backgroundColor:
              menuIndex === 1 ? "rgba(90, 166, 131, 0.4)" : "transparent",
          }}
        >
          <img src={chat} width={70} height={60} alt="" />
        </ImgContainer>

        {/* 카메라 */}
        <ImgContainer
          onClick={() => {
            navigate("/camera");
          }}
          style={{
            backgroundColor:
              menuIndex === 2 ? "rgba(90, 166, 131, 0.4)" : "transparent",
          }}
        >
          <img src={cameraIcon} width={70} height={70} alt="" />
        </ImgContainer>

        {/* 이미지 선택 */}
        <ImgContainer
          onClick={() => {
            navigate("gallery");
          }}
          style={{
            backgroundColor:
              menuIndex === 3 ? "rgba(90, 166, 131, 0.4)" : "transparent",
          }}
        >
          <img src={image} width={70} height={60} alt="" />
        </ImgContainer>
      </MeunContainer>

      {/* 뒤로가기 */}
      <img
        src={arrowRight}
        alt=""
        width={80}
        height={80}
        onClick={() => {
          navigate(-1);
        }}
        style={{ marginTop: 130 }}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 230px;
  height: 100%;
  background-color: #e4e2de;
  padding: 80px 0px;
  border-radius: 20px;
`;
const MeunContainer = styled.div`
  justify-content: flex-end;
  flex-wrap: wrap;
  display: flex;

  & > div {
    margin-bottom: 27px;
  }
`;

const ImgContainer = styled.div`
  display: flex;
  width: 192px;
  height: 120px;
  padding-left: 45px;
  // justify-content: center;
  align-items: center;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
`;
