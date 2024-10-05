import styled from "styled-components";
import arrowRight from "../assets/icon/arrowLeft.png";
import { useNavigate } from "react-router-dom";
import home from "./../assets/icon/home.png";
import chat from "./../assets/icon/chat.png";
import control from "./../assets/icon/control.png";
import setting from "./../assets/icon/setting.png";

export const SideBar = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <MeunContainer>
        <img
          src={home}
          width={70}
          height={60}
          alt=""
          onClick={() => {
            navigate("/");
          }}
        />
        <img
          src={chat}
          width={70}
          height={60}
          alt=""
          onClick={() => {
            navigate("/chat");
          }}
        />
        <img
          src={control}
          width={70}
          height={60}
          alt=""
          onClick={() => {
            navigate("/devices");
          }}
        />
        <img
          src={setting}
          width={70}
          height={60}
          alt=""
          onClick={() => {
            navigate("setting");
          }}
        />
      </MeunContainer>
      <img
        src={arrowRight}
        alt=""
        width={80}
        height={80}
        onClick={() => {
          navigate(-1);
        }}
        style={{ marginTop: 130, color: "#717171" }}
      />
    </Container>
  );
};

const ButtonWrap = styled.div``;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 230px;
  height: 988px;
  background-color: #e4e2de;
  padding: 80px 0px;
  border-radius: 20px;
`;
const MeunContainer = styled.div`
  width: 70px;
  justify-content: center;
  gap: 100px;

  & > img {
    margin-bottom: 100px;
  }
`;
