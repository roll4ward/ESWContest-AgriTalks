import React, { useState } from "react";
import MessageBox from "../component/MessageBox";
import { Button, Form, InputGroup, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MachineDetail from "../component/MachineDetail";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import data from "../mock";
import GraphContainer from "../component/GraphContainer";
export default function SensorPage() {
  return (
    <>
      <>
        <MachineDetail data={data} />
      </>
      <GraphContainer />
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0 20px;
`;
