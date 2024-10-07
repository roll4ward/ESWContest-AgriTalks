import React, { useEffect, useState, useRef } from "react";
import { Button } from "react-bootstrap";
import styled from "styled-components";
import cameraIcon from "../assets/icon/cameraIcon.svg";
import {startCamera, stopCamera, captureImage, initCamera} from "../api/mediaService";

export const Camera = () => {
  const [cameraHandle, setCameraHandle] = useState("");
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // 기존 카메라 핸들러 확인
    const storedCameraHandle = localStorage.getItem('cameraHandle');
    if(storedCameraHandle){
      localStorage.setItem('cameraHandle', "");
      setCameraHandle("");
    }

    // 카메라 미리보기 실행
    startVideoStream();

    initCamera((result)=> {
      setCameraHandle(result); 
      localStorage.setItem('cameraHandle', result);
    });

    // 컴포넌트 언마운트 시 스트림 정리
    return () => {
      if (stream) {
        stopVideoStream();
      }
    };
  }, []);

  const startVideoStream = () => {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
      .then((stream) => {
        setStream(stream);
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.log("Error..", err);
      });
  };

  const stopVideoStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      videoRef.current.srcObject = null;
    }
  };

  const capture = () => {
    if(cameraHandle){
      console.log("캡쳐실행: ", cameraHandle);
      stopVideoStream();  // 캡처 전 비디오 스트림 중지
      startCamera(cameraHandle, (result)=> {
        console.log(result);
        console.log("start 카메라 성공1");
        captureImage(cameraHandle, (result) => {
          console.log("카메라 캡쳐 결과 경로", result);
          stopCamera(cameraHandle,() => {
            startVideoStream();
          });
        });
      });
      
    } else {
      console.log("no camera Handle");
    }
  };

  return (
    <Container>
      <VideoContainer autoPlay={true} ref={videoRef}/>
      <CameraButton
        style={{
          backgroundColor: "#fff",
          borderColor: "#fff",
          borderRadius: "50%",
          height: "150px",
          width: "150px",
          marginRight: "80px",
        }}
        onClick={capture}
      >
        <img src={cameraIcon} alt="Camera" />
      </CameraButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 988px;
  background-color: #d3d3d3;
  justify-content: flex-end;
  align-items: center;
`;

const CameraButton = styled(Button)`
  z-index: 99;
`;

const VideoContainer = styled.video`
  width: 100%;
  height: 988px;
`;