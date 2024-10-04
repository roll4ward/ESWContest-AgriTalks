import styled from "styled-components";
import sensor from "../../assets/icon/sensor.png";
import actuator from "../../assets/icon/actuator.png";

export const DeviceCountBox = ({ isSensor, count }) => {
  return (
    <Container>
        <Title>{isSensor ? "센서" : "작동기"}</Title>
        <Count>
          {count}
          <span>개</span>
        </Count>

    </Container>
  );
};

const Container = styled.div`
  display: flex;
  background-color: #ffff;
  width: 305px;
  height: 293px;
  font-size: 18px;
  text-align: center;
  border-radius: 40px;
  cursor: pointer;
  transition: opacity 0.2s ease-in-out;
  padding: 30px;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 70px;
`;

const Count = styled.p`
  text-align: right;
  font-size: 100px;
  color: #448569;

  & > span {
    font-size: 60px;
    color: #4c4c4c;
  }
`;
