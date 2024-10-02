import logo from "./logo.svg";
import "./App.css";
import GlobalStyle from "./globalStyle";
import "bootstrap/dist/css/bootstrap.min.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ChatPage from "./page/chat";
import { Camera } from "./page/Camera";
import { Home } from "./page/Home";
import { DeviceOverView } from "./page/DeviceOverView";
import { SideBar } from "./component/SideBar";

function App() {
  return (
    <Router>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "100vh",
          paddingTop: 45,
          paddingLeft: 50,
        }}
      >
        {/* 사이드 메뉴 */}
        <div style={{ width: "250px" }}>
          <SideBar />
        </div>

        {/* 콘텐츠 */}
        <div
          style={{
            flex: 1,
            overflowY: "auto", // 세로 스크롤 적용
            maxHeight: "100vh", // 최대 높이 설정
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/camera" element={<Camera />} />
            <Route path="/devices" element={<DeviceOverView />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
