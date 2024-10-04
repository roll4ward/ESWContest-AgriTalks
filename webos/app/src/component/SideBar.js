import styled from "styled-components";
import arrowRight from "../assets/icon/arrowLeft.png";
import chat from "../assets/icon/chat.png";
import { useNavigate } from "react-router-dom";

export const SideBar = () => {
  const navigate = useNavigate()
  return (
  <Container>
    <img src={arrowRight} alt="" width={80} height={80} onClick={()=> {navigate(-1)}} />
    <img src={chat} alt="" width={80} height={80} onClick={()=> {navigate("chat")}} />
  </Container>);
};

const ButtonWrap = styled.div``;
const Container = styled.div`
  display: flex;
  flex-direction: column,
  width: 230px;
  height: 988px;
  justify-content: center;
  background-color: #e4e2de;
  padding: 80px 0px;
  border-radius: 20px;
`;
