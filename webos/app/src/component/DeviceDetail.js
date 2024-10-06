import styled from "styled-components";
import RefreshIcon from "../assets/icon/Refresh.svg";
import { useEffect, useState } from "react";
import { readDevicewithID } from "../api/infomanageService";
import { readLatestValue } from "../api/coapService";

export default function DeviceDetail({ deviceID }) {
  const [deviceInfo, setDeviceInfo] = useState({
    name: "기기명",
    description: "기기설명을 추가해 주세요.",
    unit: "",
  });
  const [valueInfo, setValueInfo] = useState({
    lastupdatetime: "측정 값 없음",
    value: "X",
  });

  useEffect(() => {
    readDevicewithID(deviceID, (result) => {
      console.log(result);
      setDeviceInfo({
        name: result.name,
        description: result.desc,
        unit: result.unit,
      });
    });

    readLatestValue(deviceID, (result) => {
      let time = new Date(Date.parse(result.time));
      const formatter = new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      });

      setValueInfo({
        value: result.value,
        lastupdatetime: formatter.format(time),
      });
    });
  }, []);

  return (
    <MainWrap>
      {/* 좌측 기기명 박스 */}
      <DeviceInfoContainer>
        <DeviceName>{deviceInfo.name}</DeviceName>
        <DeviceInfo>{deviceInfo.description}</DeviceInfo>
      </DeviceInfoContainer>

      {/* 우측 기기값 박스 */}
      <ValueConiner>
        <StyledRow>
          <UpdateTitle>마지막 업데이트 시간</UpdateTitle>
          <StyledIcon src={RefreshIcon} alt="RefreshIcon" />
        </StyledRow>

        <LastUpdateTime>{valueInfo.lastupdatetime}</LastUpdateTime>

        <StyledValue>
          {valueInfo.value}
          {valueInfo.value === "X" ? "" : deviceInfo.unit}
        </StyledValue>
      </ValueConiner>
    </MainWrap>
  );
}

const MainWrap = styled.div`
  display: flex;
  justify-content: space-between;
`;
const DeviceInfoContainer = styled.div`
  display: flex;
  align-items: center;
  width: 65%;
  flex-direction: column;
  padding: 40px;
  white-space: nowrap;
`;
const DeviceName = styled.div`
  color: #448569;
  font-size: 75px;
  align-items: center;
  font-weight: 600;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
`;

const DeviceInfo = styled.div`
  color: #717171;
  font-size: 32px;
  white-space: normal; /* 텍스트가 길어지면 자동으로 줄바꿈 */
  text-overflow: ellipsis; /* 텍스트가 너무 길면 말줄임표로 표시 */
  max-height: 200px;
  overflow-y: auto;
  justify-content: center;
`;

const ValueConiner = styled.div`
  flex-grow: 1;
  padding: 40px 10px;
  background-color: #f5f5f5;
  border-radius: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const UpdateTitle = styled.div`
  color: #717171;
  font-size: 32px;
`;

const LastUpdateTime = styled.span`
  color: #717171;
  font-size: 32px;
  font-weight: 600;
`;

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledValue = styled.div`
  font-size: 128px;
  font-weight: 800;
`;

const StyledIcon = styled.img`
  width: 2rem;
  height: 2rem;
  margin-left: 20px;
  cursor: pointer;
`;
