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
import graphData from "../graphdata";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function GraphContainer() {
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
      <Line data={graphData} options={options} />
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
