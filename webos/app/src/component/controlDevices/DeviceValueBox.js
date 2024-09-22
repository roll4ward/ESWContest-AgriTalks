import styled from "styled-components";

export const DeviceValueBox = ({ isSensor }) => {
  return (
    <Container>
      <span style={{ fontSize: 55, color: "#4c4c4c" }}>
        {isSensor ? "센서1" : "작동기1"}
      </span>
      <span style={{ fontSize: 80, color: "#4c4c4c" }}>30</span>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 305px;
  height: 220px;
  background-color: #fff;
  border-radius: 40px;
  text-align: center;
  padding: 10px;
`;
