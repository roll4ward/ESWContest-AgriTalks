import React, { useEffect, useState } from "react";
import DeviceDetail from "../component/DeviceDetail";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import GraphContainer from "../component/GraphContainer";
import { ControlPannel } from "../component/dashboard/ControlPannel";
import { readDevicewithID } from "../api/infomanageService";
import { useParams } from "react-router-dom";

export default function DeviceDetailPage() {
  const [isActuator, setIsActuator] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [refreshFlag, setRefreshFlag] = useState(0);
  const { deviceID } = useParams();
  console.log("Device Detail : ", deviceID);

  useEffect(() => {
    readDevicewithID(deviceID, (result) => {
      setIsActuator(result.type === "actuator");
      setDeviceName(result.name);
    });
  }, []);

  function makeRefreshFlag() {
    if (refreshFlag > 3) setRefreshFlag(0);
    else setRefreshFlag(refreshFlag + 1);
  }

  return (
    <Container>
      <DeviceDetail deviceID={deviceID} setRefreshFlag={makeRefreshFlag} refreshFlag={refreshFlag}/>
      {isActuator && <ControlPannel deviceName={deviceName} deviceId = {deviceID} setRefreshFlag={makeRefreshFlag}/>}
      <GraphContainer deviceID={deviceID} refreshFlag={refreshFlag}/>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 0px 25px;
`;
