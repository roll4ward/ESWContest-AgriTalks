import styled from "styled-components";
import { DeviceInfoCard } from "./DeviceInfoCard";

export const InitializeDevice = () => {
  return (
    <Conttainer>
      <NotificationContiner>
        <span>추가될 기기들의 정보를 입력해주세요.</span>
        <span>N개 남음</span>
      </NotificationContiner>

      <DeviceListContainer>
        <DeviceInfoCard />
      </DeviceListContainer>
    </Conttainer>
  );
};

const Conttainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const NotificationContiner = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0px 30px;
  width: 100%;

  & > span {
    font-size: 40px;
  }
`;

const DeviceListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 30px;
  width: 100%;
  overflow-y: auto;
  max-height: 450px;
  margin-top: 20px;
`;
