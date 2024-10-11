import React from "react";
import styled, { keyframes } from "styled-components";

const orbit = keyframes`
  0% { 
    transform: rotate(0deg) translateX(20px) rotate(0deg); 
    animation-timing-function: cubic-bezier(0.0, 0.0, 0.58, 1.0); // easeOut
  }
  100% { 
    transform: rotate(360deg) translateX(20px) rotate(-360deg); 
  }
`;

const LoadingIcon = styled.div`
  display: inline-block;
  position: relative;
  width: 40px;
  height: 40px;

  div {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6px;
    height: 6px;
    background-color: #000;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: ${orbit} 1.5s linear infinite;
  }

  div:nth-child(1) {
    animation-delay: 0s;
  }
  div:nth-child(2) {
    animation-delay: 0.16s;
  }
  div:nth-child(3) {
    animation-delay: 0.32s;
  }
  div:nth-child(4) {
    animation-delay: 0.48s;
  }
`;

export default function App() {
  return (
    <LoadingIcon>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </LoadingIcon>
  );
}