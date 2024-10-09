import styled from "styled-components";
import { ModalBase } from "./ModalBase"
import { useRef, useState } from "react";
import { SelectDevice } from "./registerDevice/SelectDevice";
import { JoinNetwork } from "./registerDevice/JoinNetwork";
import { InitializeDevice } from "./registerDevice/InitializeDevice";
import { createToast } from "../../api/toast";

const PAGE = {
    SELECT_DEVICE : 0,
    JOIN_NETWORK : 1,
    INITIALIZE_DEVICE : 2
}

export const RegisterDevice = () => {
    const [page, setPage] = useState(PAGE.SELECT_DEVICE);
    const address = useRef("");
    const [hiddenCancel, setHiddenCancel] = useState(false);

    function ConfirmButtonCallback() {
        switch(page){
            case PAGE.SELECT_DEVICE:
                if (!address.current) {
                    createToast("기기를 선택해주세요!");
                    return;
                }
                setPage(PAGE.JOIN_NETWORK);
                setHiddenCancel(true);
                break;
            case PAGE.JOIN_NETWORK:
                break;
            case PAGE.INITIALIZE_DEVICE:
                break;
        }
    }

    return (
        <ModalBase show>
            <Container>
                <Title>기기 추가</Title>
                <PageContainer>
                     {page == PAGE.SELECT_DEVICE && <SelectDevice address={address}/>}
                     {page == PAGE.JOIN_NETWORK && <JoinNetwork address={address}/>}
                     {page == PAGE.INITIALIZE_DEVICE && <InitializeDevice/>}
                </PageContainer>
                <ButtonWrap>
                    <Button hidden={hiddenCancel}>취소</Button>
                    <Button primary="true" onClick={ConfirmButtonCallback}>확인</Button>
                </ButtonWrap>
            </Container>
        </ModalBase>
    );
};

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 20px;
`;

const Title = styled.div`
    margin-top: 15px;
    text-align: center;
    color: #448569;
    font-size: 80px;
`;

const ButtonWrap = styled.div`
    margin-top: 25px;
    margin-bottom: 15px;
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

const PageContainer = styled.div`
    margin-top: 5px;
    width: 100%;
    flex-grow: 1;
`;