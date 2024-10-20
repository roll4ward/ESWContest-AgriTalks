import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import MessageBox from "../component/MessageBox";
import { Button, Form, InputGroup, Card, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import { FaStopCircle } from "react-icons/fa";
import {
  askToAiStream,
  TTS,
  STT,
  audioStart,
  audioStop,
  createConversation,
  readConversation,
} from "../api/aiService";
import RecordModal from "../component/modal/RecorderModal";
import { FaMicrophone } from "react-icons/fa";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [audioId, setAudioId] = useState("");

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allMessagesLoaded, setAllMessagesLoaded] = useState(false);

  const messagesEndRef = useRef(null);
  const cardBodyRef = useRef(null);
  const initialLoadComplete = useRef(false);
  const scrollPositionRef = useRef(0); // 스크롤 위치를 저장할 ref

  const location = useLocation();
  const selectedImages = location.state?.selectedImages;
  const selectedImageDesc = location.state?.selectedImageDesc;

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchConversation = (page) => {
    setIsLoadingMore(true);

    readConversation(page, (result) => {
      if (result.texts.length > 0) {
        const conversationPage = result.texts.map((msg) => ({
          type: msg.type,
          text: msg.text,
          image: JSON.parse(msg.image),
        }));

        const prevScrollHeight = cardBodyRef.current.scrollHeight; // 기존 스크롤 높이 저장

        setMessages((prevMessages) => [...conversationPage, ...prevMessages]);

        if (result.page) {
          setNextPage(result.page);
        } else {
          setAllMessagesLoaded(true);
        }

        setIsLoadingMore(false);

        // 새로운 대화 묶음이 추가된 후, 추가된 묶음의 최신 메시지가 먼저 보이게 스크롤 조정
        setTimeout(() => {
          if (cardBodyRef.current) {
            const newScrollHeight = cardBodyRef.current.scrollHeight; // 새 스크롤 높이 계산
            const addedHeight = newScrollHeight - prevScrollHeight; // 추가된 높이 계산
            cardBodyRef.current.scrollTop = addedHeight; // 새로 추가된 메시지 묶음의 끝에 스크롤 위치 설정
          }
        }, 0); // 상태가 업데이트되고 나서 스크롤 조정
      } else {
        setAllMessagesLoaded(true);
        setIsLoadingMore(false);
      }
    });
  };

  useEffect(() => {
    const initializeChat = () => {
      readConversation(null, (result) => {
        if (result.texts.length > 0) {
          setMessages(
            result.texts.map((msg) => ({
              type: msg.type,
              text: msg.text,
              image: JSON.parse(msg.image),
            }))
          );
          if (result.page) setNextPage(result.page);
        }

        setTimeout(() => {
          scrollToBottom(); // 대화 기록이 모두 렌더링된 후 스크롤 실행
          initialLoadComplete.current = true; // 초기 로딩 완료 플래그 설정
        }, 0);

        if (selectedImages) {
          handleSendMessage("", selectedImages, selectedImageDesc);
        }
      });
    };
    initializeChat();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        cardBodyRef.current.scrollTop === 0 &&
        nextPage &&
        !isLoadingMore &&
        !allMessagesLoaded &&
        initialLoadComplete.current
      ) {
        scrollPositionRef.current = cardBodyRef.current.scrollHeight; // 스크롤 위치 저장
        fetchConversation(nextPage);
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

  useEffect(() => {
    // 메시지가 업데이트될 때마다 스크롤을 맨 아래로 이동
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (_, image, imageDesc) => {
    // 질문창이 공백이면 return
    if (prompt == "" && !image) return;

    let aiMessage = { text: "", type: "ai", image: [] };
    let text = prompt;
    let img = [];

    if (image) {
      text = imageDesc;
      img = image;
    }

    setPrompt("");
    createConversation(text, "user", img);

    // 사용자 메시지 저장, ai의 대답창을 우선 "..."으로 초기화
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: text, type: "user", image: img },
    ]);
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "ai", text: "...", image: [] },
    ]);
    scrollToBottom();

    // 스트림 질문 전송 함수
    askToAiStream(text, img, (askResult) => {
      // 스트림의 마지막 토큰이 수신되면 ai의 대답 전문을 저장 및 tts & audioStart
      scrollToBottom();
      if (!askResult.isStreaming) {
        createConversation(aiMessage.text, "ai", []);
        TTS(aiMessage.text, (path) => {
          audioStart(path, (result) => {
            setAudioId(result);
          });
        });
      } else {
        aiMessage.text = askResult.chunks;
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.slice(0, -1);
          return [...updatedMessages, aiMessage];
        });
      }
    });
  };

  const handleRecordModalClose = (audio) => {
    setShowRecordModal(false);

    if (!audio) return;

    STT(audio, (result) => {
      let aiMessage = { type: "ai", text: "", image: [] };

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: result, type: "user", image: [] },
        { text: "...", type: "ai", image: [] },
      ]);
      createConversation(result, "user", []);
      scrollToBottom();

      askToAiStream(result, "", (askResult) => {
        scrollToBottom();
        if (!askResult.isStreaming) {
          createConversation(aiMessage.text, "ai", []);
          TTS(aiMessage.text, (path) => {
            audioStart(path, (result) => {
              setAudioId(result);
            });
          });
        } else {
          aiMessage.text = askResult.chunks;
          setMessages((prevMessages) => {
            const updatedMessages = prevMessages.slice(0, -1);
            return [...updatedMessages, aiMessage];
          });
        }
      });
    });
  };

  const handleOpenRecordModal = () => {
    setShowRecordModal(true);
  };

  const handleStopBriefing = () => {
    if (audioId) {
      audioStop(audioId);
      setAudioId("");
    }
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
            <div key={idx} style={{ position: "relative" }}>
              <MessageBox
                msgType={msg.type}
                text={msg.text}
                image={msg.image}
              />
              {idx === messages.length - 1 && msg.type === "ai" && audioId && (
                <StopIcon onClick={handleStopBriefing}>
                  <FaStopCircle size={50} color="grey" />
                </StopIcon>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
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
              onClick={handleOpenRecordModal}
            >
              <FaMicrophone size={30} />
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

const StopIcon = styled.div`
  position: absolute;
  top: 50%;
  right: 80px;
  transform: translateY(-50%);
  cursor: pointer;
`;
