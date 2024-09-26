import React, { useState, useEffect } from "react";
import MessageBox from "../component/MessageBox";
import { Button, Form, InputGroup, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import {
  createKind, // Kind 생성 함수
  createSession,
  createConversation,
  readSession, // 세션 데이터 읽기
} from "../database"; // WebOS API 호출 함수들
import sendMessageToWebOS from "../api/aiService";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [sessionId, setSessionId] = useState(""); // 세션 ID를 상태로 관리

  useEffect(() => {
    const initializeChat = async () => {
      try {
        console.log("Kind 생성 중..."); // Kind 생성 시작 로그
        await createKind(); // Kind를 먼저 생성
        console.log("Kind 생성 완료"); // Kind 생성 완료 로그

        console.log("세션 생성 중..."); // 세션 생성 시작 로그
        const createdSession = await createSession();
        setSessionId(createdSession); // 생성된 세션 ID 저장
        console.log("세션 생성 완료:", createdSession); // 세션 생성 완료 및 ID 로그

        console.log("대화 기록 불러오는 중..."); // 대화 기록 로드 시작 로그
        const loadedMessages = await readSession(createdSession); // 세션 데이터 읽기
        if (loadedMessages && loadedMessages.length > 0) {
          setMessages(
            loadedMessages.map((msg) => ({
              type: msg.type,
              text: msg.text,
              kind: msg.kind, // kind 추가
            }))
          );
        } else {
          console.log("이전에 대화 기록 없음");
        }
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    initializeChat();
  }, []);

  const handleSendMessage = async () => {
    if (prompt.trim()) {
      const newMessages = [...messages, { type: "user", text: prompt }];
      setMessages(newMessages);

      try {
        // 사용자 메시지 저장
        await createConversation(sessionId, prompt, "text"); // 세션 ID와 함께 kind 전달

        // AI 응답을 받는 부분 (WebOS AI 서비스와 통신)
        const response = await sendMessageToWebOS(prompt);

        if (response.success) {
          const aiMessage = { type: "ai", text: response.result };
          setMessages((prevMessages) => [...prevMessages, aiMessage]);

          // AI 응답을 DB에 저장
          await createConversation(sessionId, response.result, "text"); // 세션 ID와 함께 kind 전달
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              type: "ai",
              text: `Error-else success: ${
                response.error || "No result from AI."
              }`,
            },
          ]);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "ai", text: `Error-catch: ${error}` },
        ]);
      }

      setPrompt("");
    } else {
      console.warn("Input이 입력되지 않았습니다");
    }
  };

  return (
    <Container>
      <StyledCard>
        <CardBody>
          {messages.map((msg, idx) => (
            <MessageBox key={idx} msgType={msg.type} text={msg.text} />
          ))}
        </CardBody>
        <CardFooter>
          <InputGroup>
            <Form.Control
              placeholder="텍스트를 입력하세요."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{ height: "50px", fontSize: "1.5rem" }}
            />
            <Button
              style={{ backgroundColor: "#448569", color: "#fff" }}
              onClick={handleSendMessage}
            >
              ↑
            </Button>
          </InputGroup>
        </CardFooter>
      </StyledCard>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0 20px;
`;

const StyledCard = styled(Card)`
  width: 80%;
  max-width: 1400px;
  background-color: #f5f5f5;
`;

const CardBody = styled(Card.Body)`
  height: 80vh;
  overflow-y: scroll;
`;

const CardFooter = styled(Card.Footer)`
  padding: 15px;
`;
