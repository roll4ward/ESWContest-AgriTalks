import styled from "styled-components";
import add from "../assets/icon/add.png";
import { DeviceMonitorBox } from "../component/controlDevices/DeviceMonitorBox";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { readAllAreas, readDeviceswithArea } from "../api/infomanageService";
import { RegisterDevice } from "../component/modal/RegisterDevice";

export const DeviceOverView = () => {
  const [areaID, setAreaID] = useState(useParams().areaID);
  const [areas, setAreas] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [sensors, setSensors] = useState([]);
  const [actuators, setActuators] = useState([]);
  const [currentArea, setCurrentArea] = useState({});

  console.log("area ID : ", areaID);

  useEffect(() => {
    readAllAreas((result) => {
      setAreas(
        result.map((area) => ({ name: area.name, areaID: area.areaID, description: area.desc }))
      );
    });
    loadDevices();
  }, []);

  useEffect(() => {
    if (!areaID) {
      return;
    }
    const area = areas.find((area) => area.areaID === areaID);
    setCurrentArea(area);
  }, [areaID, areas]);

  function loadDevices(flag) {
    readDeviceswithArea(areaID, (result) => {
      console.log(result);
      if (flag === "actuator" || !flag) {
        setActuators([]);
        setActuators(result.filter((device) => device.type === "actuator"));
      }
      if (flag === "sensor" || !flag) {
        setSensors([]);
        setSensors(result.filter((device) => device.type === "sensor"));
      }
    });
  }

  useEffect(() => {
    if (!showRegisterModal) {
      loadDevices();
    }
  }, [showRegisterModal, areaID]);

  return (
    <Container>
      <EventWrapper>
        <select
          name="area"
          style={{ width: 391, height: 80, fontSize: 40 }}
          onChange={(e) => {
            setAreaID(e.target.value);
          }}
          value={areaID}
        >
          {areas.map((area) => (
            <option value={area.areaID}>{area.name}</option>
          ))}
        </select>
        <Button
          onClick={() => {
            setShowRegisterModal(true);
          }}
        >
          <img src={add} alt="" width={48} height={48} />
          {"기기 추가"}
        </Button>
      </EventWrapper>

      <DeviceDescriptionWrapper>
        <Description>{currentArea?.description}</Description>
      </DeviceDescriptionWrapper>

      <DeviceMonitorWapprer>
        {/* 센서 */}
        <DeviceMonitorBox
          isSensor
          devices={sensors}
          loadDevices={loadDevices}
        />

        {/* 작동기 */}
        <DeviceMonitorBox devices={actuators} loadDevices={loadDevices} />
      </DeviceMonitorWapprer>
      <RegisterDevice
        show={showRegisterModal}
        setShow={setShowRegisterModal}
        areaId={areaID}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 60px;
`;

const EventWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding-top: 10px;
`;

const Button = styled.button`
  background-color: #448569;
  width: 266px;
  height: 83px;
  border-width: 0;
  border-radius: 20px;
  font-size: 40px;
  font-weight: 700;
  flex-direction: row;
  color: #ffff;
  align-items: center;
  justify-content: center;

  &:active {
    opacity: 0.7;
  }
`;

const DeviceMonitorWapprer = styled.div`
  display: flex;
  padding-top: 20px;
  justify-content: space-between;
`;

const DeviceDescriptionWrapper = styled.div`
  display: flex;
  width: 100%;
`;

const Description = styled.div`
  color: #717171;
  font-size: 50px;
  white-space: normal;
  text-overflow: ellipsis;
  max-height: 200px;
  overflow-y: auto;
`;
