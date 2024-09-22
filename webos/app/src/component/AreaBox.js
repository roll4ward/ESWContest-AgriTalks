import styled from "styled-components";
import { DeviceCountBox } from "./DeviceCountBox";

export const AreaBox = () => {
  return (
    <Container>
      <AreaName>{"하우스 1호"}</AreaName>
      <InputText>{"재배 : 포도"}</InputText>

      <DeviceWrap>
        <DeviceCountBox />
      </DeviceWrap>
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
  padding: 40px;
  border-radius: 20px;
`;

const AreaName = styled.p`
  font-size: 64px;
  font-weight: 600;
`;

const InputText = styled.p`
  font-size: 40px;
`;

const DeviceWrap = styled.div`
  gap: 40px;
  display: flex;
  flex-direction: row;
`;
