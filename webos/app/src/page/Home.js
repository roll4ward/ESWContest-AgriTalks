import styled from "styled-components";
import add from "../icon/add.png";
import { AreaBox } from "../component/AreaBox";

export const Home = () => {
  return (
    <Container>
      <TextWrap>
        <Title>{"안녕하세요,"}</Title>
        <SubTitleWrap>
          <Text>
            {"든든한 농업 파트너 "}
            <span>농담</span>
            입니다.
          </Text>
        </SubTitleWrap>
      </TextWrap>

      <ButtonConatiner>
        <Button>
          <img src={add} alt="" width={48} height={48} />
          {"구역 추가"}
        </Button>
      </ButtonConatiner>

      <AreaBox />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 1920px;
  height: 1080px;
  flex-direction: column;
  padding: 60px;
`;

const TextWrap = styled.div`
  justify-content: flex-start;
  display: flex;
  flex-direction: column;
`;
const SubTitleWrap = styled.div`
  display: flex;
  flex-direction: row;
`;

const Title = styled.p`
  font-size: 75px;
  color: #448569;
  font-weight: 700;
`;

const Text = styled.p`
  font-size: 64px;
  margin: 5px 0;

  & > span {
    font-size: 64px;
    color: #448569;
    font-weight: 700;
  }
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
`;

const ButtonConatiner = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`;
