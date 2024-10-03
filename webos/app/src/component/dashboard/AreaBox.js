import styled from "styled-components";
import { DeviceCountBox } from "./DeviceCountBox";
import arrowRight from "../../assets/icon/arrowRight.png";

export const AreaBox = ({name, description}) => {
  return (
    <Container>
      <AreaName>{name}</AreaName>
      <InputText>{description}</InputText>

      <DeviceWrap>
        <DeviceCountBox isSensor />
        <DeviceCountBox />
      </DeviceWrap>

      <ImageWrap>
        <img src={arrowRight} alt="" width={80} height={80} />
      </ImageWrap>
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

  &:active {
    opacity: 0.7;
  }
`;

const AreaName = styled.p`
  font-size: 64px;
  font-weight: 600;
`;

const InputText = styled.p`
  font-size: 40px;
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const DeviceWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px 0px;
`;

const ImageWrap = styled.div`
  display: flex;
  align-self: flex-end;
  paddingtop: ;
`;
