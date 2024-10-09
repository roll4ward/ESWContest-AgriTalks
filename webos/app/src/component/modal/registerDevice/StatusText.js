import styled from "styled-components";
import check from "../../../assets/icon/check.png";
import LoadingIcon from "./LoadingIcon";

export const StatusText = ({doing, done, status, current})=>{
    return (
        <Container hidden={status - 1 > current}>
            <Text> {current >= status ? done : doing}</Text>
              {current >= status ? (
                <img src={check} alt="" width={40} height={40} />
              ) : (
                <LoadingIcon />
              )}
        </Container>
    );
}

const Text = styled.div`
  font-size: 50px;
  margin-right: 10px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;