import { createGlobalStyle } from "styled-components";
import Pretendard from "./assets/font/Pretendard-Regular.woff";

const GlobalStyle = createGlobalStyle`
@font-face { 
  font-family: "Pretendard";
  src: url(${Pretendard}) format("woff");
}


body {
    font-family: 'Pretendard';
    margin: 0;
    font-size: 16px;
    .wrap{
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    background-color: #f3f5f6;
    }
}

.start{
  opacity: 0;
}
.end{
  opacity: 1;
  transition : opacity 5s;
}

`;

export default GlobalStyle;
