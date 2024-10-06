import logo from "./logo.svg";
import "./App.css";
import GlobalStyle from "./globalStyle";
import "bootstrap/dist/css/bootstrap.min.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ChatPage from "./page/chat";
import { Camera } from "./page/Camera";
import { Home } from "./page/Home";
import DeviceDetailPage from "./page/DeviceDetailPage";
import DeviceDetailPage from "./page/DeviceDetailPage";
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
          width: "1920px",
          padding: "25px",
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
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/camera" element={<Camera />} />
            <Route path="/devices/:areaID" element={<DeviceOverView />} />
            <Route path="/detail/:deviceID" element={<DeviceDetailPage />} />
            <Route path="/gallery" element={<div />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
