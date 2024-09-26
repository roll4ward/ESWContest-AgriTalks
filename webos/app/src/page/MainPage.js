import React from "react";
import { useNavigate } from "react-router-dom";
import data from "../mock"; // 센서 데이터 가져오기

export default function MainPage() {
  const navigate = useNavigate();

  // AI와 대화하기 버튼 클릭 핸들러
  const LinkToChat = () => {
    navigate("/chat");
  };

  // 센서 상세 페이지로 이동하는 버튼 클릭 핸들러
  const LinkToSensor = (id) => {
    navigate(`/sensor/${id}`);
  };

  return (
    <>
      <p>메인페이지입니다</p>
      <button onClick={LinkToChat}>AI와 대화하기</button>
      <div>
        <h3>센서 상세 보기</h3>
        {/* 데이터에서 센서 객체의 속성을 사용하여 버튼 생성 */}
        {data.map((sensor) => (
          <button key={sensor.id} onClick={() => LinkToSensor(sensor.id)}>
            {sensor.name} 상세보기
          </button>
        ))}
      </div>
    </>
  );
}
