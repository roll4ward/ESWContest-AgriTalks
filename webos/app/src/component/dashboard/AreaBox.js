import styled from "styled-components";
import { DeviceCountBox } from "./DeviceCountBox";
import arrowRight from "../../assets/icon/arrowRight.png";
import edit from "../../assets/icon/Edit.svg";
import trash from "../../assets/icon/trash.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CheckDelete } from "../modal/CheckDelete";
import { AreaInfoInput } from "../modal/AreaInfoInput";

export const AreaBox = ({ areaInfo, onEdit, onDelete }) => {
  const { name, desc, sensorCount, actuatorCount, areaID } = areaInfo;
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const [areaModalShow, setAreaModalShow] = useState(false);

  console.log(`${name} : ${areaID}`);

  return (
    <Container>
      <CheckDelete
        show={showDelete}
        setShow={setShowDelete}
        onDelete={() => {
          onDelete(areaID);
        }}
      />
      <AreaInfoInput
        show={areaModalShow}
        onSubmit={onEdit}
        setShow={setAreaModalShow}
        title={"구역 수정"}
        areaName={name}
        areaDescription={desc}
      />
      <AreaName>{name}</AreaName>
      <InputText>{desc}</InputText>

      <DeviceWrap>
        <DeviceCountBox count={sensorCount} isSensor />
        <DeviceCountBox count={actuatorCount} />
      </DeviceWrap>

      <ButtonWrap>
        <InfoEditWrap>
          <img
            src={edit}
            width={60}
            height={60}
            onClick={() => {
              setAreaModalShow(true);
            }}
          />
          <img
            src={trash}
            width={60}
            height={60}
            onClick={() => {
              setShowDelete(true);
            }}
          />
        </InfoEditWrap>
        <img
          src={arrowRight}
          width={80}
          height={80}
          onClick={() => {
            navigate(`/devices/${areaID}`);
          }}
        />
      </ButtonWrap>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 730px;
  height: 650px;
  background-color: #f5f5f5;
  padding: 30px 40px 20px 40px;
  border-radius: 20px;

  margin-top: 20px;

  &:active {
    opacity: 0.7;
  }
`;

const AreaName = styled.div`
  font-size: 64px;
  font-weight: 600;
  text-overflow: ellipsis;
  overflox: hidden;
`;

const InputText = styled.div`
  font-size: 40px;
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  height: 50px;
`;

const DeviceWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px 0px;
`;

const ButtonWrap = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const InfoEditWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  & > * {
    margin-left: 30px;
  }
`;
