// ChatPage.js
import React, { useState, useEffect,useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // useNavigate, useLocation 추가
import MessageBox from "../component/MessageBox";
import { Button, Form, InputGroup, Card, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import { askToAiStream, TTS, STT, audioStart, audioStop, createConversation, readConversation } from "../api/aiService";
import { initRecord} from "../api/mediaService";
import RecordModal from "../component/modal/RecorderModal";
import { FaMicrophone, FaImage } from "react-icons/fa";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);  
  const [nextPage, setNextPage] = useState(null); // 다음 페이지 정보를 저장할 상태
  const [prompt, setPrompt] = useState("");
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [recorderId, setRecorderId] = useState("");
  const [audioId, setAudioId] = useState("");
  
  const [isLoadingMore, setIsLoadingMore] = useState(false); // 이전 대화 불러올 때 로딩 상태
  const [allMessagesLoaded, setAllMessagesLoaded] = useState(false); // 더 이상 불러올 메시지가 없는 상태 추가

  const navigate = useNavigate();
  const messagesEndRef = useRef(null); // 스크롤 끝을 참조할 ref 생성
  const cardBodyRef = useRef(null); // 대화 내용이 들어가는 요소에 대한 ref 생성
  const initialLoadComplete = useRef(false); // 초기 렌더링 완료 여부

  // 스크롤을 가장 아래로 이동하는 함수
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // WebOS 서비스를 통해 대화 기록을 불러오는 함수
  const fetchConversation = (page) => {
    setIsLoadingMore(true); // 로딩 상태로 설정
    readConversation(page, (result) => {
      if (result && result.texts && result.texts.length > 0) {
        const conversationPage = result.texts.map((msg) => ({
          type: msg.type,
          text: msg.text,
          image: msg.image, // msg.image로 이미지 처리
        }));

        setMessages((prevMessages) => [...conversationPage, ...prevMessages]); // 기존 메시지에 추가

        if (result.page) {
          setNextPage(result.page); // 다음 페이지가 있을 경우 업데이트
        } else {
          setAllMessagesLoaded(true); // 더 이상 불러올 메시지가 없으면 true
        }

        setIsLoadingMore(false); // 로딩 상태 종료
      } else {
        setAllMessagesLoaded(true); // 더 이상 불러올 메시지가 없으면 true
        setIsLoadingMore(false); // 로딩 상태 종료
      }
    });
  };

  useEffect(() => {
    const initializeChat = () => {
      fetchConversation(null); // 페이지를 1로 설정하고 대화 불러오기
      setTimeout(() => {
        scrollToBottom(); // 대화 기록이 모두 렌더링된 후 스크롤 실행
        initialLoadComplete.current = true; // 초기 로딩 완료 플래그 설정
      }, 0);
      initRecord((result) => {
        setRecorderId(result);
        console.log("ChatPage: 레코더 초기화 완료.", result);
      });
    };
    initializeChat();
  }, []);

  // 스크롤 맨 위로 이동했을 때 이전 대화 내용 불러오기
  useEffect(() => {
    const handleScroll = () => {
      // 스크롤이 맨 위로 도달했는지 확인하는 조건
      if (
        cardBodyRef.current.scrollTop === 0 && // 스크롤이 맨 위에 도달했을 때
        nextPage && // 다음 페이지가 있을 때
        !isLoadingMore && // 현재 로딩 중이 아닐 때
        !allMessagesLoaded && // 모든 메시지를 다 불러오지 않았을 때
        initialLoadComplete.current // 초기 로딩이 완료되었을 때
      ) {
        console.log("스크롤이 맨 위로 이동했습니다. 이전 대화 불러오기.");
        fetchConversation(nextPage); // 다음 페이지의 대화 불러오기
      }
    };

    if (cardBodyRef.current) {
      cardBodyRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (cardBodyRef.current) {
        cardBodyRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [nextPage, isLoadingMore, allMessagesLoaded]);

  const handleSendMessage = (_ , image, imageDesc) => {
    // 질문창이 공백이면 return
    if (prompt == "" && !image) {
      
      // -----------------------------------------------------------
      // 임시 태스트용 코드

      // ai가 한창 브리핑 중에 빈 프롬프트로 메세지 전송 버튼을 누르면 오디오가 중단 됨
      if (audioId) {
        audioStop(audioId);
        console.log("stop", audioId);
        setAudioId("");
      }

      // 대화 내용이 10개 초과로 있어야 태스트 가능
      // 다음 페이지가 있는 경우 이전 대화내용 10개 추가로 불러오는 함수
      // 스크롤바가 맨 위로 이동하는 이벤트에 이 함수를 넣어주면 됨
      if(nextPage){
        readConversation(nextPage, (result)=> {
          const list = result.texts.map((msg) => ({ type: msg.type, text: msg.text, image:msg.image }))
          setMessages([...list , ...messages]);
          if(result.page){
            setNextPage(result.page);
          }else{
            setNextPage("");
          }
        });
      }
      // ~~ 임시 태스트용 코드
      
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
      // 스트림의 마지막 토큰이 수신되면 ai의 대답 전문을 저장 및 tts & audioStart
      if(!askResult.isStreaming){
        createConversation(aiMessage.text, "ai");
        TTS(aiMessage.text, (path)=> {
          audioStart(path ,(result)=> {
            setAudioId(result);
          }); 
        });
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
          // 스트림의 마지막 토큰이 수신되면 ai의 대답 전문을 저장 및 tts & audioStart
          if(!askResult.isStreaming){
            createConversation(aiMessage.text, "ai", "");
            TTS(aiMessage.text, (path)=> { 
              audioStart(path, (result)=> {
                setAudioId(result);
              }); 
            });
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
        <CardBody ref={cardBodyRef}>
          {isLoadingMore && (
            <SpinnerWrapper>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </SpinnerWrapper>
          )}
          {messages.map((msg, idx) => (
            <MessageBox
              key={idx}
              msgType={msg.type}
              text={msg.text}
              image={msg.image}
            />
          ))}
          <div ref={messagesEndRef} /> {/* 메시지 끝 ref 추가 */}
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
              style={{
                backgroundColor: "#448569",
                color: "#fff",
                width: "5%",
                fontSize: "30px",
              }}
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

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  margin-bottom: 10px;
`;
