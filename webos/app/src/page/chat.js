import React, { useState } from "react";
import MessageBox from "../component/MessageBox";
import { Button, Form, InputGroup, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import { sendMessageToWebOS } from "../api/aiService";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [dryRun, setDryRun] = useState(false);
  const [images, setImages] = useState([]);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { type: "user", text: input }];
      setMessages(newMessages);
      console.log("User message sent: ", input);

      try {
        const response = await sendMessageToWebOS(input, dryRun, images);

        if (response.success) {
          setMessages([...newMessages, { type: "ai", text: response.result }]);
        } else {
          setMessages([
            ...newMessages,
            {
              type: "ai",
              text: `Error-else success: ${
                response.error || "No result from AI."
              }`,
            },
          ]);
        }
      } catch (error) {
        setMessages([
          ...newMessages,
          { type: "ai", text: `Error-catch: ${error.message}` },
        ]);
      }

      setInput("");
    } else {
      console.warn("Input is empty, no message sent.");
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
