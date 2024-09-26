import styled from "styled-components";
import { useParams } from "react-router-dom";
import RefreshIcon from "../assets/icon/Refresh.svg";
import EditIcon from "../assets/icon/Edit.svg";
export default function MachineDetail({ data }) {
  const { id } = useParams();

  // id를 정수로 변환하여 데이터에서 검색
  const machineData = data.find((machine) => machine.id === parseInt(id));

  // 데이터가 없는 경우 처리
  if (!machineData) {
    return <p>Data not found</p>;
  }

  return (
    <MainWrap>
      <InfoWrap>
        <StyledRow>
          <StyledName>{machineData.name}</StyledName>
          <StyledIcon src={EditIcon} />
        </StyledRow>
        <StyledRow>
          <StyledContent>{machineData.info}</StyledContent>
          <StyledIcon src={EditIcon} />
        </StyledRow>
      </InfoWrap>
      <ValueWrap>
        <StyledRow>
          <div style={{ fontWeight: "600", color: "#717171" }}>
            마지막 업데이트 시간
          </div>
          <StyledIcon src={RefreshIcon} alt="RefreshIcon" />
        </StyledRow>
        <div style={{ color: "#717171" }}>{machineData.lastupdatetime}</div>
        <StyledValue>{machineData.value}</StyledValue>
      </ValueWrap>
    </MainWrap>
  );
}

const MainWrap = styled.div`
  display: flex;
  justify-content: space-around;
`;
const InfoWrap = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 50px;
`;

const ValueWrap = styled.div`
  width: 50%;
  background-color: #f5f5f5;
  border-radius: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const StyledRow = styled.div`
  display: flex;

  align-items: center;
`;

const StyledName = styled.div`
  color: #448569;
  font-size: 35px;
  font-weight: 600;
  margin-bottom: 10px;
`;

const StyledValue = styled.div`
  font-size: 50px;
  font-weight: 800;
`;
const StyledContent = styled.div`
  color: #717171;
  font-size: 15px;
  word-wrap: break-word; /* 긴 단어가 있을 경우 자동 줄바꿈 */
  white-space: normal; /* 텍스트가 길어지면 자동으로 줄바꿈 */
  max-width: 300px; /* 너비 제한 */
  overflow: hidden; /* 넘치는 내용을 숨김 */
  text-overflow: ellipsis; /* 텍스트가 너무 길면 말줄임표로 표시 */
  height: auto; /* 높이는 자동 조절 */
  max-height: 200px; /* 최대 높이 지정, 넘으면 스크롤 생성 */
  overflow-y: auto; /* 세로로 스크롤 생성 */
`;
const StyledIcon = styled.img`
  width: 15px;
  height: 15px;
  margin-left: 10px;
  cursor: pointer;
`;
