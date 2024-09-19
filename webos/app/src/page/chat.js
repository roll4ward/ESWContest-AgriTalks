import React, { useState } from "react";
import MessageBox from "../component/MessageBox";
import { Button, Form, InputGroup, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";

export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { type: "user", text: "LG, 현재 농장 상태를 보고해줘" },
    {
      type: "ai",
      text: "2024년 8월 1일 기준, 광량은 ~~이고 습도는 ~~이고 온도는 ~~이고 수분량은 ~~~입니다. 광량은 ~~이고 습도는 ~~이고 온도는 ~~이고 수분량은 ~~~입니다. ",
    },
    { type: "user", text: "그렇구나. 알려줘서 고마워! 오늘의 날씨는 어때?" },
    { type: "ai", text: "오늘의 날씨는 맑음입니다. 오후부터 비가 예상됩니다." },
  ]);
  const [input, setInput] = useState("");

  const onClickCamera = () => {
    navigate("/camera");
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { type: "user", text: input }]);
      setInput("");
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
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ height: "50px", fontSize: "1.5rem" }}
            />
            <Button
              style={{ backgroundColor: "#448569", color: "#white" }}
              onClick={handleSendMessage}
            >
              ↑
            </Button>
            <Button
              style={{ backgroundColor: "#448569", color: "#white" }}
              onClick={onClickCamera}
            ></Button>
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
