import React, { useEffect, useState, useRef } from "react";
import { Button } from "react-bootstrap";
import styled from "styled-components";
import cameraIcon from "../assets/icon/cameraIcon.svg";
import {captureImage, initCamera} from "../api/mediaService";

export const Camera = () => {
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    startVideoStream();

    // 컴포넌트 언마운트 시 스트림 정리
    return () => {
      if (stream) {
        stopVideoStream();
      }
    };
  }, []);

  const startVideoStream = () => {
    console.log("startVideoStream");
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
      .then((stream) => {
        setStream(stream);
        console.log(stream);
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.log("Error..", err);
      });
  };

  const stopVideoStream = (callback) => {
    console.log("stopVideoStream");
    if (stream) {
      console.log("스트림이있다.");
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      videoRef.current.srcObject = null;
    }
  };

  const capture = () => {
    // if(cameraHandle){
      stopVideoStream();  // 캡처 전 비디오 스트림 중지
      // await captureImage(cameraHandle, (result) => {
      //   console.log("캡쳐실행: ", cameraHandle);
      // });
      console.log(stream);
      initCamera((result)=> {
        // console.log("loacl없음",result);
        // setCameraHandle(result); 
        // localStorage.setItem('cameraHandle', result);
        startVideoStream();
      });
      // startVideoStream();
    // } else {
    //   console.log("no camera Handle");
    // }
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