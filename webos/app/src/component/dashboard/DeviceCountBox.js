import styled from "styled-components";
import sensor from "../../icon/sensor.png";
import actuator from "../../icon/actuator.png";

export const DeviceCountBox = ({ isSensor }) => {
  return (
    <Container>
      <Title>{isSensor ? "센서" : "작동기"}</Title>

      <CountWrap>
        <img
          src={isSensor ? sensor : actuator}
          alt=""
          width={109}
          height={109}
        />
        {/* <img src={actuator} alt="" width={109} height={109} /> */}

        <Count>
          {"N"}
          <span>개</span>
        </Count>
      </CountWrap>
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
const Title = styled.p`
  display: flex;
  justify-contents: flex-start;
  font-size: 50px;
`;

const CountWrap = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
`;

const Count = styled.p`
  font-size: 100px;
  color: #448569;

  & > span {
    font-size: 60px;
    color: #4c4c4c;
  }
`;
