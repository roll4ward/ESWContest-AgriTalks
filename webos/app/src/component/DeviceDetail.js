import styled from "styled-components";
import RefreshIcon from "../assets/icon/Refresh.svg";
import { useEffect, useState } from "react";
import { readDevicewithID } from "../api/infomanageService";
import { readLatestValue } from "../api/coapService";

export default function DeviceDetail({ deviceID }) {
  const [deviceInfo, setDeviceInfo] = useState({ name : "기기", description : "기기설명", unit : ""});
  const [valueInfo, setValueInfo] = useState({ lastupdatetime : "측정 값 없음", value : "X"});

  useEffect(()=> {
    readDevicewithID(deviceID, (result)=> {
      console.log(result);
      setDeviceInfo({
        name: result.name,
        description: result.desc,
        unit: result.unit
      });
    });
    readLatestValue(deviceID, (result) => {
      let time = new Date(Date.parse(result.time));
      const formatter = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      });

      setValueInfo({
        value: result.value,
        lastupdatetime: formatter.format(time)
      })
    })
  }, []);
  
  return (
    <MainWrap>
      <InfoWrap>
        <StyledRow>
          <StyledName>{deviceInfo.name}</StyledName>
        </StyledRow>
        <StyledRow>
          <StyledContent>{deviceInfo.description}</StyledContent>
        </StyledRow>
      </InfoWrap>
      <ValueWrap>
        <StyledRow>
          <div style={{ fontWeight: "600", color: "#717171", fontSize: "2rem" }}>
            마지막 업데이트 시간
          </div>
          <StyledIcon src={RefreshIcon} alt="RefreshIcon"/>
        </StyledRow>
        <div style={{ color: "#717171", fontSize: "2rem" }}>{valueInfo.lastupdatetime}</div>
        <StyledValue>{valueInfo.value}{valueInfo.value === "X" ? "" : deviceInfo.unit}</StyledValue>
      </ValueWrap>
    </MainWrap>
  );
}

const MainWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;
const InfoWrap = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 50px;
  width: 40%;
`;

const ValueWrap = styled.div`
  width: 50%;
  background-color: #f5f5f5;
  border-radius: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const StyledRow = styled.div`
  display: flex;
  align-items: center;

  & > * {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
`;

const StyledName = styled.div`
  color: #448569;
  font-size: 7.5rem;
  font-weight: 600;
  margin-bottom: 10px;
`;

const StyledValue = styled.div`
  font-size: 7.5rem;
  font-weight: 800;
`;
const StyledContent = styled.div`
  color: #717171;
  font-size: 2.5rem;
  word-wrap: break-word; /* 긴 단어가 있을 경우 자동 줄바꿈 */
  white-space: normal; /* 텍스트가 길어지면 자동으로 줄바꿈 */
  max-width: 300px; /* 너비 제한 */
  overflow: hidden; /* 넘치는 내용을 숨김 */
  text-overflow: ellipsis; /* 텍스트가 너무 길면 말줄임표로 표시 */
  height: auto; /* 높이는 자동 조절 */
  max-height: 200px; /* 최대 높이 지정, 넘으면 스크롤 생성 */
  overflow-y: auto; /* 세로로 스크롤 생성 */
`;
const StyledIcon = styled.img`
  width: 2rem;
  height: 2rem;
  margin-left: 20px;
  cursor: pointer;
`;
