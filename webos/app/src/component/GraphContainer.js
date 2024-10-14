import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { readAllValues } from "../api/coapService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function GraphContainer({ deviceID, deviceData }) {
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    console.log("deviceData에는 뭐가있을까요 : ", deviceData);
    if (!deviceID) {
      return;
    }

    // 기기 내 값들 불러오기
    readAllValues(deviceID, (result) => {
      console.log("result in Graph : ", result);
      setGraphValues(result);
    });
  }, [deviceID]);

  const setGraphValues = (data) => {
    if (!data) {
      return;
    }
    // newData 초기화
    let newData = {
      labels: [],
      datasets: [
        {
          label: "측정값",
          data: [],
        },
      ],
    };

    for (let i = 0; i < data.length; i++) {
      const targetDate = new Date(data[i].time);
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // 24시간 내의 데이터만 추가
      if (targetDate >= twentyFourHoursAgo && targetDate <= now) {
        newData.labels.push(data[i].time);
        newData.datasets[0].data.push(data[i].value);
      }
    }
    console.log("newData : ", newData);
    setGraphData(newData);
  };

  // 차트 옵션 설정
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 30,
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 32,
          },
        },
      },
      y: {
        max: 100, // Y축 최대값 설정
        min: 0, // Y축 최소값 설정
        ticks: {
          font: {
            size: 20,
          },
        },
      },
    },
  };

  return (
    <GraphWrap>
      {graphData?.labels?.length > 0 ? (
        <Line data={graphData} options={options} />
      ) : (
        <NoDataText>
          측정된 데이터가 없어요. 센서 연결을 확인해 주세요.
        </NoDataText>
      )}
    </GraphWrap>
  );
}

const GraphWrap = styled.div`
  height: 600px;
  background-color: #f5f5f5;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap;
  overflow: hidden;
`;

const NoDataText = styled.span`
  display: flex;
  font-size: 50px;
  color: #4c4c4c;
  width: 100%;
  justify-content: center;
`;
