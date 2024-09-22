import styled from "styled-components";
import sensor from "../icon/sensor.png";

export const DeviceCountBox = () => {
  return (
    <Container>
      <Title>{"센서"}</Title>

      <img src={sensor} alt="" width={48} height={48} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  background-color: #ffff;
  color: black;
  width: 305px;
  height: 293px;
  font-size: 18px;
  text-align: center;
  border-radius: 40px;
  cursor: pointer;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.7;
  }

  &:active {
    opacity: 0.5;
  }
`;
const Title = styled.p`
  font-size: 50px;
`;
