import styled from "styled-components";
import refresh from "../../assets/icon/refresh.png";
import { DeviceValueBox } from "./DeviceValueBox";
import { useNavigate } from "react-router-dom";

export const DeviceMonitorBox = ({ isSensor, devices }) => {
  const navigate = useNavigate();
  const currentTime = new Date().toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  console.log("devices : ", devices);
  return (
    <Container>
      <TitleWrapper>
        <Title>{isSensor ? "센서" : "작동기"}</Title>

        <ControllWrapper>
          <Time>{currentTime}</Time>
          <img src={refresh} alt="" width={48} height={48} />
        </ControllWrapper>
      </TitleWrapper>

      <BoxWrapper>
        {devices.length < 1 ? (
          <NoDataText>기기를 추가해 주세요</NoDataText>
        ) : (
          devices.map((device) => {
            return (
              <DeviceValueBox device={device} />
            );
          })
        )}
      </BoxWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 737px;
  padding: 40px;
  background-color: #f5f5f5;
  border-radius: 20px;
  flex-direction: column;
`;

const Title = styled.span`
  font-size: 80px;
  color: #448569;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ControllWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
`;

const Time = styled.span`
  font-size: 50px;
`;

const BoxWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-top: 50px;
  gap: 40px;
`;

const NoDataText = styled.span`
  display: flex;
  font-size: 50px;
  color: #4c4c4c;
  width: 100%;
  justify-content: center;
`;
