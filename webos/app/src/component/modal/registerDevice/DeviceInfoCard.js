import styled from "styled-components";
import { Chips } from "../../shared/Chips";
import DEVICE_TYPE from "../../../device_type.json";

const TYPE = DEVICE_TYPE.TYPE;
const SUBTYPE = DEVICE_TYPE.SUBTYPE;

export const DeviceInfoCard = ({deviceInfo, isInit, onEdit, areaNameInfo}) => {
  console.log(areaNameInfo);
  return (
    <Containter>
      <InformationContaienr>
        <DeviceName>
          {deviceInfo.name}
          <DeviceDescription>{deviceInfo.desc ? deviceInfo.desc: "기기 설명을 추가해 주세요"}</DeviceDescription>
        </DeviceName>

        <ChipsContainer>
          <Chips text={ areaNameInfo[deviceInfo.areaId] ? areaNameInfo[deviceInfo.areaId] : "구역을 입력해주세요"} />
          <Chips text={TYPE[deviceInfo.type]} />
          <Chips text={SUBTYPE[deviceInfo.subtype]} />
        </ChipsContainer>
      </InformationContaienr>

      <Button onClick={onEdit}>{isInit ? "정보 수정": "정보 입력"}</Button>
    </Containter>
  );
};

const Containter = styled.div`
  display: flex;
  padding: 20px 30px;
  background-color: #f5f5f5;
  border-radius: 20px;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const InformationContaienr = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  max-width: 850px;
`;

const DeviceName = styled.div`
  font-size: 40px;
  font-weight: 600;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const DeviceDescription = styled.div`
  margin-bottom: 10px;
  font-size: 30px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const ChipsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const Button = styled.button`
  padding: 50px;
  background-color: #fff;
  border-radius: 25px;
  border-width: 4px;
  border-color: #448569;

  font-size: 30px;
  font-weight: 700;
  color: #448569;
`;
