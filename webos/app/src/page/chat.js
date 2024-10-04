// ChatPage.js
import React, { useState, useEffect } from "react";
import MessageBox from "../component/MessageBox";
import { Button, Form, InputGroup, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import { askToAi, TTS, speak, createConversation, readAllConversation, deleteAllConversation } from "../api/aiService";
import RecordModal from "../component/modal/RecorderModal";
import { FaMicrophone } from "react-icons/fa"; // 마이크 아이콘 추가

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [showRecordModal, setShowRecordModal] = useState(false);

  useEffect(() => {
    const initializeChat = () => {
      readAllConversation((result)=> {
        if(result){
          setMessages(result.map((msg) => ({ type: msg.type, text: msg.text})));
        }else{
          console.log("이전에 대화 기록 없음");
        }
      });
    };
    initializeChat();
  }, []);

  const handleSendMessage = () => {
    if (prompt == "") {
      return;
    }

    const newMessages = [...messages, { type: "user", text: prompt }];
    setMessages(newMessages);
    // 사용자 메시지 저장
    createConversation(prompt, "user"); // 세션 ID와 함께 kind 전달
    setPrompt("");
    // AI 응답을 받는 부분 (WebOS AI 서비스와 통신)
    askToAi(prompt, (askResult)=> {
      const aiMessage = { type: "ai", text: askResult };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      createConversation(askResult, "ai"); // 세션 ID와 함께 kind 전달

      TTS(askResult, ()=> {
        speak();
      });

    });
  };

  const handleRecordModalClose = () => {
    setShowRecordModal(false);
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

            <Button
              style={{ backgroundColor: "grey", color: "#fff" }}
              onClick={() => setShowRecordModal(true)}
            >
              <FaMicrophone />
            </Button>
          </InputGroup>
        </CardFooter>
      </StyledCard>
      <RecordModal
        show={showRecordModal}
        handleClose={handleRecordModalClose}
      />
    </Container>
  );
}

// 전체 컨테이너 스타일
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

// 카드 스타일
const StyledCard = styled(Card)`
  width: 600px;
  height: 80vh;
  display: flex;
  flex-direction: column;
`;

// 카드 본문 스타일
const CardBody = styled(Card.Body)`
  overflow-y: auto;
  flex-grow: 1;
`;

// 카드 푸터 스타일
const CardFooter = styled(Card.Footer)`
  background-color: #f8f9fa;
`;