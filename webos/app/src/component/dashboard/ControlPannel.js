import styled from "styled-components";
import React, { useState } from "react";
import { sendValue } from "../../api/coapService";

export const ControlPannel = ({ deviceName, deviceId, setRefreshFlag }) => {
  const [actuatorVolume, setActuatorVolume] = useState(0);

  /* 슬라이더 값이 변할 떄 값을 set */
  const onChaneVolume = (e) => {
    setActuatorVolume(e.target.value);
  };

  /* 버튼 클릭시, 해당 값으로 set */
  const onClickBtn = (value) => {
    setActuatorVolume(value);
    sendValue(deviceId, value, (result)=>{
      console.log(result, "is written");
      setRefreshFlag(result);
    })
  };

  const sendCurrentValue = () => {
    sendValue(deviceId, actuatorVolume, (result)=>{
      console.log(result, "is written");
      setRefreshFlag(result);
    })
  }

  return (
    <Container>
      <TitleContainer>
        <Title>
          {`${deviceName || "작동기"} 제어`}
          <span>{`${actuatorVolume}%`}</span>
        </Title>
      </TitleContainer>

      <SliderContainer>
        <Slider
          id="actuator"
          name="actuator"
          min="0"
          max="100"
          value={actuatorVolume}
          onChange={onChaneVolume}
          onTouchEnd={sendCurrentValue}
        />
        <ValueMarkers>
          <Button onClick={() => onClickBtn(0)}>OFF</Button>
          <Button onClick={() => onClickBtn(33)}>약</Button>
          <Button onClick={() => onClickBtn(67)}>중</Button>
          <Button onClick={() => onClickBtn(100)}>강</Button>
        </ValueMarkers>
      </SliderContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 268px;
  background-color: #f5f5f5;
  border-radius: 20px;
  margin-top: 20px;
  padding: 40px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-item: center;
`;
const Title = styled.p`
  font-size: 40px;

  & > span {
    margin-left: 20px;
    font-size: 40;
    color: #448569;
    font-weight: 700;
  }
`;

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
`;

const Slider = styled.input.attrs({ type: "range" })`
  width: 100%;
  height: 10px;
  -webkit-appearance: none;
  background: #ddd;
  border-radius: 5px;
  outline: none;
  margin-top: 10px;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 50px;
    height: 50px;
    background: #4caf50;
    cursor: pointer;
    border-radius: 50%;
  }
`;

const ValueMarkers = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const Button = styled.button`
  background-color: #448569;
  border-width: 0px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 45px;
  color: #fff;
  padding: 5px 40px;

  &:hover {
    text-decoration: underline;
  }
`;
