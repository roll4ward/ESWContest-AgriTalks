import React from "react";
import { Button } from "react-bootstrap";
import styled from "styled-components";
import cameraIcon from "../assets/icon/cameraIcon.svg";

export const Camera = () => {
  const getCameraList = () => {
    return new Promise((resolve, reject) => {
      let isRequset = {
        service: "luna://com.webos.service.camera2",
        method: "getCameraList",
        onSuccess: () => {
          resolve();
        },
        onFailure: () => {
          reject();
        },
      };
    });
  };

  const startCamera = () => {
    return new Promise((resolve, reject) => {
      let isRequset = {
        service: "luna://com.webos.service.camera2",
        method: "startCamera",
        onSuccess: () => {
          resolve();
        },
        onFailure: () => {
          reject();
        },
      };
    });
  };

  const captureImage = () => {
    return new Promise((resolve, reject) => {
      let isRequset = {
        service: "luna://com.webos.service.camera2",
        method: "capture",
        parameters: { handle: 189, nimage: 2 }, //path 추가 예정
        onSuccess: () => {
          resolve();
        },
        onFailure: () => {
          reject();
        },
      };
    });
  };

  return (
    <Container>
      <Button
        style={{
          backgroundColor: "#fff",
          borderColor: "#fff",
          borderRadius: "50%",
          height: "150px",
          width: "150px",
          marginRight: "80px",
        }}
      >
        <img src={cameraIcon} />
      </Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #d3d3d3;
  justify-content: flex-end;
  align-items: center;
`;
