const graphData = {
  labels: ["월", "화", "수", "목", "금"], // X축 레이블
  datasets: [
    {
      label: "측정값", // 첫 번째 라인
      data: [20, 40, 50, 80, 60], // 센서 값 (Y축 값)
      borderColor: "#C43C30", // 라인 색상
      fill: false, // 배경 채우기 비활성화
    },
    {
      label: "비교값", // 두 번째 라인
      data: [30, 80, 55, 45, 70], // 센서 값 (Y축 값)
      borderColor: "#859BC2", // 라인 색상
      fill: false, // 배경 채우기 비활성화
    },
  ],
};

export default graphData;
