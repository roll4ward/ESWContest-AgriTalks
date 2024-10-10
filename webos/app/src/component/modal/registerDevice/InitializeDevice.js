import styled from "styled-components";
import { DeviceInfoCard } from "./DeviceInfoCard";
import { useEffect, useState } from "react";
import { readAllAreas, readDevicewithIDs } from "../../../api/infomanageService";
import { DeviceInfoInput } from "../DeviceInfoInput";
import { initializeDevice } from "../../../api/newDevice";

export const InitializeDevice = ({devicesRef, isDone, areaId}) => {
  const [devices, setDevices] = useState([]);
  const [initializedDevice, setInitializedDevice] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState(null);
  const [areaInfos, setAreaInfos] = useState({});
  
  useEffect(()=>{
    loadDevices();
    loadAreas();
  }, [])

  useEffect(()=>{
    isDone.current = (initializedDevice.length === devicesRef.current.length);
    console.log(isDone.current);
  }, [initializedDevice]);

  function onEditSubmit(name, description, area) {
    initializeDevice({
      deviceId: deviceToEdit._id,
      name: name,
      description: description,
      areaId: area
    },
    ()=>{
      if (!initializedDevice.includes(deviceToEdit._id)) setInitializedDevice([...initializedDevice, deviceToEdit._id]);
      setDeviceToEdit(null);
      loadDevices();
    })
  }

  function loadDevices() {
    console.log(devicesRef.current);
    readDevicewithIDs(devicesRef.current, (result) => {
      setDevices(result);
    })
  }

  function loadAreas() {
    readAllAreas((results)=> {
      console.log("Areas : ", results);
      const area_name_info = results.reduce((acc, cur) => {
        acc[cur.areaID] = cur.name;
        return acc;
      }, {});
      console.log("area_name_info : ", area_name_info);
      setAreaInfos(area_name_info);
    })
  }

  return (
    <Conttainer>
      <NotificationContiner>
        <span>추가될 기기들의 정보를 입력해주세요.</span>
        <span>{devicesRef.current.length - initializedDevice.length}개 남음</span>
      </NotificationContiner>

      <DeviceListContainer>
        {devices.map((deviceInfo) => (
          <DeviceInfoCard deviceInfo={deviceInfo}
                          isInit={initializedDevice.includes(deviceInfo._id)}
                          onEdit={()=>{
                            setDeviceToEdit(deviceInfo);
                            setShowEditModal(true);
                          }}
                          areaNameInfo={areaInfos}/>
        ))}
      </DeviceListContainer>
      <DeviceInfoInput show = {showEditModal} setShow={setShowEditModal}
                       onSubmit={onEditSubmit} title={"기기 정보 입력"}
                       deviceName={deviceToEdit?.name}
                       deviceArea={deviceToEdit?.areaId === "null" ? areaId : deviceToEdit?.areaId}
                       deviceDescription={deviceToEdit?.desc}/>
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
