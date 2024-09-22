import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatPage from "./page/chat";
import { Camera } from "./page/Camera";
import { Home } from "./page/Home";
import { DeviceOverView } from "./page/DeviceOverView";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/devices" element={<DeviceOverView />} />
      </Routes>
    </Router>
  );
}

export default App;
