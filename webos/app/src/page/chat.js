// ChatPage.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // useNavigate, useLocation 추가
import MessageBox from "../component/MessageBox";
import { Button, Form, InputGroup, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import { askToAiStream, TTS, STT, speak, createConversation, readConversation, deleteAllConversation } from "../api/aiService";
import { initRecord} from "../api/mediaService";
import RecordModal from "../component/modal/RecorderModal";
import { FaMicrophone } from "react-icons/fa";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState("");
  const [prompt, setPrompt] = useState("");
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [recorderId, setRecorderId] = useState("");

  const location = useLocation();
  const selectedImage = location.state?.selectedImage;
  const selectedImageDesc = location.state?.selectedImageDesc;

  useEffect(() => {
    readConversation(null, (result)=> {
      setMessages(result.texts.map((msg) => ({ type: msg.type, text: msg.text, image:msg.image })));
      if(result.page) setPage(result.page)
    });

    initRecord((result)=> {
      setRecorderId(result); 
    });
    
    // 이미지가 있으면 메세지 전송
    if (selectedImage) {
      handleSendMessage("",selectedImage, selectedImageDesc);
    }

  }, []);

  const handleSendMessage = (_ , image, imageDesc) => {
    // 질문창이 공백이면 return
    if (prompt == "" && !image) {

      // -----------------------------------------------------------
      // 임시 태스트용 코드
      // 대화 내용이 10개 초과로 있어야 태스트 가능
      // 다음 페이지가 있는 경우 이전 대화내용 10개 추가로 불러오는 함수
      // 스크롤바가 맨 위로 이동하는 이벤트에 이 함수를 넣어주면 됨 
      if(page){
        readConversation(page, (result)=> {
          const list = result.texts.map((msg) => ({ type: msg.type, text: msg.text, image:msg.image }))
          setMessages([...list , ...messages]);
          if(result.page){
            setPage(result.page);
          }else{
            setPage("");
          }
        });
      }
      // ~ 임시 태스트용 코드
      // -----------------------------------------------------------

      return;
    }
    
    // 사용자 메시지 저장
    const newMessages = [...messages, { type: "user", text: image? imageDesc : prompt, image: image}];
    setMessages(newMessages);
    createConversation(image ? imageDesc : prompt, "user", image);
    setPrompt("");

    // ai의 대답창을 우선 "..."으로 초기화
    setMessages((prevMessages) => [...prevMessages,{type: "ai",text: "..."}]);
    let aiMessage = { type: "ai", text: ""};
    
    // 스트림 질문 전송 함수
    askToAiStream(image? imageDesc : prompt, image, (askResult)=> {
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

  const handleRecordModalClose = (audio) => {
    setShowRecordModal(false);
    if (audio) {
      STT(audio, (result) => {

        // 사용자 메시지 저장
        const newMessages = [...messages, { type: "user", text: result }];
        setMessages(newMessages);
        createConversation(result, "user", "");

        // ai의 대답창을 우선 "..."으로 초기화
        setMessages((prevMessages) => [...prevMessages,{type: "ai",text: "..."}]);
        let aiMessage = { type: "ai", text: "" };

        // 스트림 질문 전송 함수
        askToAiStream(result, "", (askResult)=> {
          // 스트림의 마지막 토큰이 수신되면 ai의 대답 전문을 저장 및 tts & speak
          if(!askResult.is_streaming){
            createConversation(aiMessage.text, "ai", "");
            TTS(aiMessage.text, ()=> { speak(); });
          }else{
            aiMessage.text = askResult.chunks;
            setMessages((prevMessages) => {
              const updatedMessages = prevMessages.slice(0, -1);
              return([...updatedMessages, aiMessage]);
            });
          }
        });
      });
    }
  };
  
  const handleOpenRecordModal = () => {
    setShowRecordModal(true); // 녹음 모달 열기
  };

  return (
    <Container>
      <StyledCard>
        <CardBody>
          {messages.map((msg, idx) => (
            <MessageBox key={idx} msgType={msg.type} text={msg.text} image={msg.image}/>
          ))}
        </CardBody>
        <CardFooter>
          <InputGroup>
            <Form.Control
              placeholder="텍스트를 입력하세요."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{ height: "80px", fontSize: "20px" }}
            />
            <Button
              style={{ backgroundColor: "#448569", color: "#fff", width: "5%", fontSize: "30px"}}
              onClick={handleSendMessage}
            >
              ↑
            </Button>

            <Button
              style={{
                backgroundColor: "#FF6F61",
                color: "#fff",
                width: "5%",
                fontSize: "30px",
              }}
              onClick={handleOpenRecordModal} // 녹음 모달 열기 버튼
            >
              <FaMicrophone size={30} />
            </Button>
          </InputGroup>
        </CardFooter>
      </StyledCard>
      <RecordModal
        show={showRecordModal}
        handleClose={handleRecordModalClose}
        recorderId={recorderId} 
      />
    </Container>
  );
}

// 전체 컨테이너 스타일
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const StyledCard = styled(Card)`
  width: 100%;
  height: 988px;
  display: flex;
  flex-direction: column;
`;

const CardBody = styled(Card.Body)`
  overflow-y: auto;
  flex-grow: 1;
`;

const CardFooter = styled(Card.Footer)`
  background-color: #f8f9fa;
`;
