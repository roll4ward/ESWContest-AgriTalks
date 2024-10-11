import styled from "styled-components";
import refresh from "../../assets/icon/refresh.png";
import { DeviceValueBox } from "./DeviceValueBox";
import { useEffect, useState } from "react";
import { deleteDevice, readDeviceswithArea, updateDeviceInfo, updateDeviceParentArea } from "../../api/infomanageService";
import { createToast } from "../../api/toast";

export const DeviceMonitorBox = ({ isSensor, devices, loadDevices }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshFlag, setRefreshFlag] = useState(0);

  function onRefresh() {
    setCurrentTime(new Date());
    loadDevices(isSensor ? "sensor" : "actuator");
    setRefreshFlag(refreshFlag > 2 ? 0 : refreshFlag + 1);
  }

  function onDeviceEdit(deviceID, name, description, area) {
    if(!name) return;
    updateDeviceInfo(deviceID, name, description, (result) => {
      console.log("Device updated : ", result);
      updateDeviceParentArea(deviceID, area, (result) => {
        console.log(result);
        createToast("기기 정보가 수정되었습니다.");
        loadDevices();
      })
    });
  }

  function onDeviceDelete(deviceID) {
    deleteDevice(deviceID, (result)=>{
      if (!result) {
        createToast("기기 삭제를 실패했습니다.");
        return;
      }

      createToast("기기가 삭제되었습니다.");
      loadDevices();
    })
  }

  console.log("devices : ", devices);
  return (
    <Container>
      <TitleWrapper>
        <Title>{isSensor ? "센서" : "작동기"}</Title>

        <ControllWrapper>
          <Time>
            { 
              currentTime.toLocaleTimeString("ko-KR", 
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }
              )
            }
          </Time>
          <img onClick={onRefresh} src={refresh} alt="" width={48} height={48} />
        </ControllWrapper>
      </TitleWrapper>

      <BoxWrapper>
        {devices.length < 1 ? (
          <NoDataText>기기를 추가해 주세요</NoDataText>
        ) : (
          devices.map((device) => {
            return (
              <DeviceValueBox device={device}
                onDelete={onDeviceDelete}
                onEdit={onDeviceEdit.bind(null, device._id)}
                refreshFlag={refreshFlag}/>
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
