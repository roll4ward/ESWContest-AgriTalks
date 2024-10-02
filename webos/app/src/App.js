import logo from "./logo.svg";
import "./App.css";
import GlobalStyle from "./globalStyle";
import "bootstrap/dist/css/bootstrap.min.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ChatPage from "./page/chat";
import { Camera } from "./page/Camera";
import MainPage from "./page/MainPage";
import SensorPage from "./page/SensorPage";
function App() {
  return (
    <>
      <GlobalStyle />

      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/sensor/:id" element={<SensorPage />} />
          <Route path="/camera" element={<Camera />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
