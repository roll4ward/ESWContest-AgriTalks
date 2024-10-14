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
import { readRecentValues } from "../api/coapService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function GraphContainer({ deviceID }) {
  const [graphData, setGraphData] = useState(null);
  const [maxValue, setMaxValue] = useState(100);

  useEffect(() => {
    if (!deviceID) {
      return;
    }

    // 기기 내 값들 불러오기
    readRecentValues(deviceID, 24, (result) => {
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
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
        },
      ],
    };

    data.forEach((data)=> {
      newData.labels.push(data.time);
      newData.datasets[0].data.push(data.value)
    });

    setMaxValue(Math.max(newData.datasets[0].data));
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
          callback: function(val, index, ticks) {
          const now = new Date();
          const time = new Date(this.getLabelForValue(val));
          const diff = Math.floor((now - time) / (1000 * 60 * 60));

          // 이전 라벨 값 저장
          const prevLabel = index > 0 ? this.getLabelForValue(ticks[index - 1].value) : null;

          if (diff === 0) {
            // 이전 라벨과 같은 경우 빈 문자열 반환
            if (prevLabel && 
              new Date(prevLabel).getHours() === time.getHours() &&
              new Date(prevLabel).getMinutes() === time.getMinutes()) {
              return "";
            }
            return "1시간 전";
          }
          
          else if (diff < 24) {
            // 이전 라벨과 같은 경우 빈 문자열 반환
            if (prevLabel && new Date(prevLabel).getHours() === time.getHours()) {
              return "";
            }
            return `${diff +1}시간 전`;
          } 
          
          else {
            return time.toLocaleDateString();
          }
          },
          font: {
            size: 20,
          },
        },
        grid: {
          display: false
        },
      },
      y: {
        max: maxValue, // Y축 최대값 설정
        min: 0, // Y축 최소값 설정
        ticks: {
          font: {
            size: 20,
          },
        }
      },
    },
  };

  return (
    <GraphWrap>
      {graphData?.labels?.length > 0 ? (
        <Line data={graphData} options={options} />
      ) : (
        <NoDataText>
          최근 24시간 사이의 데이터가 없어요.
        </NoDataText>
      )}
    </GraphWrap>
  );
}

const GraphWrap = styled.div`
  width: 100%;
  padding: 15px;
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
