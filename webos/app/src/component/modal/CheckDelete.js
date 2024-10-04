import styled from "styled-components"
import { ModalBase } from "./ModalBase"


export const CheckDelete = ({show, setShow, onDelete}) => {
    function onSubmit() {
        onDelete();
        setShow(false);
    }

    return (
        <ModalBase show={show}>
            <Container>
                <Title>정말로 삭제하시겠습니까?</Title>
                <ButtonWrap>
                    <Button onClick={()=>{setShow(false)}}>취소</Button>
                    <Button primary onClick={onSubmit}>확인</Button>
                </ButtonWrap>
            </Container>
        </ModalBase>
    )
}

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 15px;
`;

const Title = styled.div`
    text-align: center;
    color: #448569;
    font-size: 80px;
    margin-bottom: 100px;
`;

const ButtonWrap = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const Button = styled.button`
    border-radius: 10px;
    border: 0;
    width: 48%;
    height: 95px;
    font-size: 50px;
    text-align: center;
    color: white;
    background-color: ${props=>props.primary ? "#448569" : "#D9D9D9"};
`;


