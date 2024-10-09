import styled from "styled-components";

export const Chips = ({ backgroundColor, text, textColor }) => {
  return (
    <Container
      style={{ background: backgroundColor ?? "rgba(68, 133, 105, 0.4)" }}
    >
      <span style={{ color: textColor ?? "#1b1b1b", fontSize: 30 }}>
        {text}
      </span>
    </Container>
  );
};

const Container = styled.div`
  border-radius: 50px;
  padding: 5px 50px;
  align-self: center;
  justify-content: center;
  margin-right: 10px;
`;
