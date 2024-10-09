import { useEffect, useState } from "react";
import styled from "styled-components";
import check from "../../../assets/icon/check.png";
import LoadingIcon from "./LoadingIcon";

export const JoinNetwork = () => {
  const [value, setValue] = useState();
  const [lines, setLines] = useState([false, false, false, false, false]);

  let status = 3;

  useEffect(() => {
    if (status < 0 || status > 4) {
      return;
    }
    setLines((prevLines) => {
      const newLines = [...prevLines];
      newLines[status] = true;
      return newLines;
    });
  }, [status]);

  return (
    <Container>
      <ContentsContainer>
        <TextContainer>
          <Text>새로운 기기에 연결하기</Text>
          {lines[0] && (
            <RightTextContainer>
              <Text> {status >= 1 ? "연결 완료" : "연결 중"}</Text>
              {status >= 1 ? (
                <img src={check} alt="" width={40} height={40} />
              ) : (
                <LoadingIcon />
              )}
            </RightTextContainer>
          )}
        </TextContainer>

        <TextContainer>
          <Text>네트워크 참여 명령 전송</Text>
          {lines[1] && (
            <RightTextContainer>
              <Text> {status >= 2 ? "전송 완료" : "전송 중"}</Text>
              {status >= 2 ? (
                <img src={check} alt="" width={40} height={40} />
              ) : (
                <LoadingIcon />
              )}
            </RightTextContainer>
          )}
        </TextContainer>

        <TextContainer>
          <Text>네트워크 참여</Text>
          {lines[2] && (
            <RightTextContainer>
              <Text> {status >= 3 ? "참여 완료" : "참여 중"}</Text>
              {status >= 3 ? (
                <img src={check} alt="" width={40} height={40} />
              ) : (
                <LoadingIcon />
              )}
            </RightTextContainer>
          )}
        </TextContainer>

        <TextContainer>
          <Text>기기 정보 확인</Text>
          {lines[3] && (
            <RightTextContainer>
              <Text> {status >= 4 ? "확인 완료" : "확인 중"}</Text>
              {status >= 4 ? (
                <img src={check} alt="" width={40} height={40} />
              ) : (
                <LoadingIcon />
              )}
            </RightTextContainer>
          )}
        </TextContainer>

        <TextContainer>
          <Text>기기 정보 저장</Text>
          {lines[4] && (
            <RightTextContainer>
              <Text> {status >= 5 ? "저장 완료" : "저장 중"}</Text>
              {status >= 5 ? (
                <img src={check} alt="" width={40} height={40} />
              ) : (
                <LoadingIcon />
              )}
            </RightTextContainer>
          )}
        </TextContainer>
      </ContentsContainer>
    </Container>
  );
};

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

const Text = styled.div`
  font-size: 50px;
  margin-right: 10px;
`;

const RightTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
