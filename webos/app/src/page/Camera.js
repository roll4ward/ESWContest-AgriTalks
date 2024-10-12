import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import cameraIcon from "../assets/icon/cameraIcon.svg";
import { openCamera, captureCamera, closeCamera } from "../api/camera";
import { convertJpg } from "../api/mediaService";

export const Camera = () => {
  const [stream, setStream] = useState(null);
  const [handle, setHandle] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    startVideoStream();

    return () => {
      stopVideoStream();
    };
  }, []);

  const startVideoStream = async () => {
    try{
      console.log("startVideoStream");
      let stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false})
      setStream(stream);
      console.log(stream);
      videoRef.current.srcObject = stream;
      console.log("videostream done");

      let handle = await openCamera(false);
      setHandle(handle);
    }
    catch(err) {
      console.log(err);
    }
  };

  const stopVideoStream = async () => {
    try {
      await closeCamera(handle);
      setHandle(0);
    }
    catch(err) {
      console.log(err);
    }
  };

  const capture = () => {
    if(!handle) return;
    captureCamera(handle);
    
    // 캡쳐가 끝나고 jpg 변환 실행
    // callback 함수로 처리해야하는지 검토필요
    convertJpg();
  };

  return (
    <Container>
      <VideoContainer autoPlay={true} ref={videoRef}/>
      <CameraButton onClick={capture}>
        <img src={cameraIcon} alt="Camera" />
      </CameraButton>
    </Container>
  );
};

const Container = styled.div`
  display: block;
  width: 100%;
  height: 100%;
  background-color: #d3d3d3;
  position: relative;
`;

const CameraButton = styled.div`
  border-color: white;
  border-radius: 50%;
  z-index: 99;
  position: absolute;
  top: calc(50% - 75px);
  right: 50px;
  height: 150px;
  width: 150px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;

  &:active {
    background-color: gray;
  }
`;

const VideoContainer = styled.video`
  width: 100%;
`;