import { useState } from "react";
import styled from "styled-components";
import { StatusText } from "./StatusText";

export const JoinNetwork = ({address}) => {
  const [status, setStatus] = useState(0);

  return (
    <Container>
      <ContentsContainer>
        <TextContainer>
          <Text>새로운 기기에 연결하기</Text>
          <StatusText doing={"연결 중"} done = {"연결 완료"}
                      status={1} current={status} />
        </TextContainer>

        <TextContainer>
          <Text>네트워크 참여 명령 전송</Text>
          <StatusText doing={"전송 중"} done = {"전송 완료"}
                      status={2} current={status} />
        </TextContainer>

        <TextContainer>
          <Text>네트워크 참여</Text>
          <StatusText doing={"참여 중"} done = {"참여 완료"}
                      status={3} current={status} />
        </TextContainer>

        <TextContainer>
            <Text>기기 정보 확인</Text>
            <StatusText doing={"확인 중"} done = {"확인 완료"}
                      status={4} current={status} />
        </TextContainer>

        <TextContainer>
          <Text>기기 정보 저장</Text>
          <StatusText doing={"저장 중"} done = {"저장 완료"}
                      status={5} current={status} />
        </TextContainer>
      </ContentsContainer>
    </Container>
  );
};

const Text = styled.div`
  font-size: 50px;
  margin-right: 10px;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
`;

const ContentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 25px;
`;