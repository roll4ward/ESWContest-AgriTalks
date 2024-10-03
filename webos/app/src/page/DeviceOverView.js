import styled from "styled-components";
import add from "../assets/icon/add.png";
import { DeviceMonitorBox } from "../component/controlDevices/DeviceMonitorBox";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { readAllAreas } from "../api/infomanageService"

export const DeviceOverView = () => {
  const { areaID } = useParams();
  const navigate = useNavigate();
  const today = new Date();

  console.log("area ID : ", areaID);

  const sensors = [
    { id: 0, name: "센서1" },
    { id: 1, name: "센서2" },
  ];
  const actuator = [];

  // 날짜 형식 포맷팅
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const day = weekDays[today.getDay()];

  const formattedDate = `${year}.${month}.${date} (${day})`; // 포맷된 날짜

  const [areas, setAreas] = useState([]);

  useEffect(()=> {
    readAllAreas((result) => {
      setAreas(result.map(area => ({ name: area.name, areaID: area.areaID })));
    });
  }, []);

  return (
    <Container>
      <TitleWrapper>
        <TopText>
          {formattedDate}
          <span>서울시 강남구</span>
        </TopText>
        <Line />
      </TitleWrapper>

      <EventWrapper>
        <select name="area" style={{ width: 391, height: 80, fontSize: 40 }} onChange={(e) => {navigate(`/devices/${e.target.value}`)}}>
          { areas.map((area)=>(<option value={area.areaID}>{area.name}</option>)) }
        </select>
        <Button>
          <img src={add} alt="" width={48} height={48} />
          {"기기 추가"}
        </Button>
      </EventWrapper>

      <DeviceMonitorWapprer>
        {/* 센서 */}
        <DeviceMonitorBox isSensor devices={sensors} />

        {/* 작동기 */}
        <DeviceMonitorBox devices={actuator} />
      </DeviceMonitorWapprer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 60px;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const TopText = styled.p`
  display: flex;
  font-size: 50px;
  color: #1b1b1b;
  flex-direction: column;
  width: 610px;

  & > span {
    font-size: 80px;
    color: #448569;
    font-weight: 700;
  }
`;

const Line = styled.div`
  width: 3px;
  height: 210px;
  background-color: #d9d9d9;
`;

const EventWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding-top: 90px;
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