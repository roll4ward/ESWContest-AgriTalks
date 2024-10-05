// ChatPage.js
import React, { useState, useEffect } from "react";
import MessageBox from "../component/MessageBox";
import { Button, Form, InputGroup, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import { askToAi, askToAiStream, TTS, speak, createConversation, readAllConversation, deleteAllConversation } from "../api/aiService";
import { readAllImages, startCameraPreview, stopCameraPreview, captureImage } from "../api/imageService";
import RecordModal from "../component/modal/RecorderModal";
import { FaMicrophone } from "react-icons/fa"; // 마이크 아이콘 추가

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [images, setImages] = useState([]);

  // 태스트를 위한 image path 예시
  // var selectImage = "/media/multimedia/images/tomato2.jpg";
  var selectImage = null
//  만약 이미지 load를 성공하면 다음과 같이 데이터가 들어옴 (이미지가 들어있어야함)
//   [
//     {
//         "width": 612,
//         "last_modified_date": "Sat Oct  5 02:48:17 2024 GMT",
//         "dirty": false,
//         "file_path": "file:///media/multimedia/images/tomato.jpg",
//         "height": 547,
//         "file_size": 32502,
//         "title": "tomato.jpg",
//         "uri": "storage:///media/multimedia/media/multimedia/images/tomato.jpg"
//     },
//     {
//         "width": 612,
//         "last_modified_date": "Sat Oct  5 03:28:39 2024 GMT",
//         "dirty": false,
//         "file_path": "file:///media/multimedia/images/tomato1.jpg",
//         "height": 547,
//         "file_size": 32502,
//         "title": "tomato1.jpg",
//         "uri": "storage:///media/multimedia/media/multimedia/images/tomato1.jpg"
//     },
//     {
//         "width": 612,
//         "last_modified_date": "Sat Oct  5 03:34:26 2024 GMT",
//         "dirty": false,
//         "file_path": "file:///media/multimedia/images/tomato2.jpg",
//         "height": 547,
//         "file_size": 32502,
//         "title": "tomato2.jpg",
//         "uri": "storage:///media/multimedia/media/multimedia/images/tomato2.jpg"
//     }
// ]
  useEffect(() => {
    const initializeChat = () => {
      readAllConversation((result)=> {
        if(result){
          setMessages(result.map((msg) => ({ type: msg.type, text: msg.text})));
        }else{
          console.log("이전에 대화 기록 없음");
        }
      });

      // 초기 이미지 목록 업데이트 함수
      readAllImages((result)=> {
        if(result){
          console.log(result)
          setImages(result);
        }else{
          console.log("저장된 이미지 없음");
        }
      });
    };
    initializeChat();
  }, []);

  const handleSendMessage = () => {

    // 질문창이 공백이면 return
    if (prompt == "") {
      return;
    }

    // 사용자 메시지 저장
    const newMessages = [...messages, { type: "user", text: prompt }];
    setMessages(newMessages);
    createConversation(prompt, "user");
    setPrompt("");

    // ai의 대답창을 우선 "..."으로 초기화
    setMessages((prevMessages) => [...prevMessages,{type: "ai",text: "..."}]);
    var aiMessage = { type: "ai", text: "" };
    
    // 스트림 질문 전송 함수
    askToAiStream(prompt, selectImage, (askResult)=> {
      // 스트림의 마지막 토큰이 수신되면 ai의 대답 전문을 저장 및 tts & speak
      if(!askResult.is_streaming){
        createConversation(aiMessage.text, "ai");
        TTS(aiMessage.text, ()=> { speak(); });
      }else{
        aiMessage.text = askResult.chunks;
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.slice(0, -1);
          return([...updatedMessages, aiMessage]);
        });
      }
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
// last modifier geonha
// comment: 화면이 작다해서 비율을 맞췄습니다!
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

// 카드 스타일
const StyledCard = styled(Card)`
  width: 100%;
  height: 988px;
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