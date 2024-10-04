import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { readLatestValue } from "../../api/coapService";

export const DeviceValueBox = ({ device }) => {
  const navigate = useNavigate();
  const { _id, name, unit } = device;
  const [value, setValue] = useState("X");

  useEffect(()=> {
    readLatestValue(_id, (result) => {
      setValue(`${result.value}${unit}`);
    })
  }, []);

  console.log("devices : ", device);
  return (
    <Container onClick={() => {navigate(`/detail/${_id}`)}}>
      <span style={{ fontSize: 55, color: "#4c4c4c", width: "100%", textOverflow: "ellipsis", overflow: "hidden"}}>{name}</span>
      <span style={{ fontSize: 80, color: "#4c4c4c", width: "100%", textOverflow: "ellipsis", overflow: "hidden"}}>{value}</span>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 305px;
  height: 220px;
  background-color: #fff;
  border-radius: 40px;
  text-align: center;
  padding: 10px;
`;
