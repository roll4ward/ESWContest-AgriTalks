import styled from "styled-components";
import { ModalBase } from "./ModalBase";
import { useState, useRef } from "react";
import { SelectDevice } from "./registerDevice/SelectDevice";
import { JoinNetwork } from "./registerDevice/JoinNetwork";
import { InitializeDevice } from "./registerDevice/InitializeDevice";
import { createToast } from "../../api/toast";
import { stopBLEScan } from "../../api/newDevice";
import { deleteDevice } from "../../api/infomanageService";

const PAGE = {
  SELECT_DEVICE: 0,
  JOIN_NETWORK: 1,
  INITIALIZE_DEVICE: 2,
};

export const RegisterDevice = ({show, setShow, areaId}) => {
    const [page, setPage] = useState(PAGE.SELECT_DEVICE);
    const address = useRef("");
    const newDevices = useRef([]);
    const isRegisterDone = useRef(false);
    const [cancelVisible, setCancelVisible] = useState(true);

    function ConfirmButtonCallback() {
        switch(page){
            case PAGE.SELECT_DEVICE:
              if (!address.current) {
                  createToast("기기를 선택해주세요!");
                  return;
              }
              stopBLEScan();
              setPage(PAGE.JOIN_NETWORK);
              setCancelVisible(false);
              break;
            case PAGE.JOIN_NETWORK:
              if (newDevices.current.length < 1) {
                createToast("기기 등록이 완료될 때까지 기다려주세요.");
                return;
              }
              setPage(PAGE.INITIALIZE_DEVICE);
              setCancelVisible(true);
              break;
            case PAGE.INITIALIZE_DEVICE:
              if (!isRegisterDone.current) {
                createToast("모든 기기에 정보를 입력해주세요!");
                return;
              }
              createToast("기기 등록이 완료되었습니다!");
              closeModal();
              break;
        }
    }

    function CancelButtonCallback() {
      switch(page){
        case PAGE.SELECT_DEVICE:
            stopBLEScan();
            closeModal();
            break;
        case PAGE.JOIN_NETWORK:
            break;
        case PAGE.INITIALIZE_DEVICE:
            newDevices.current.forEach((deviceId) => {
              deleteDevice(deviceId);
            });
            createToast("기기 등록을 취소하였습니다.");
            closeModal();
            break;
      }
    }

    function closeModal() {
      console.log("Start Close Modal");
      address.current = "";
      newDevices.current = [];
      isRegisterDone.current = false;
      setShow(false);
      setPage(PAGE.SELECT_DEVICE);
      setCancelVisible(true);
      stopBLEScan();
      console.log("End Close Modal");
    }

    return (
        <ModalBase show={show}>
            <Container>
                <Title>기기 추가</Title>
                <PageContainer>
                     {page == PAGE.SELECT_DEVICE && <SelectDevice address={address} show={show}/>}
                     {page == PAGE.JOIN_NETWORK && <JoinNetwork address={address} onFailed={closeModal} devices={newDevices}/>}
                     {page == PAGE.INITIALIZE_DEVICE && <InitializeDevice devicesRef={newDevices} areaId={areaId} isDone={isRegisterDone}/>}
                </PageContainer>
                <ButtonWrap>
                    <Button visible={cancelVisible} onClick={CancelButtonCallback}>취소</Button>
                    <Button visible={true} primary="true" onClick={ConfirmButtonCallback}>확인</Button>
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
  visibility: ${(props) => (props.visible ? "visible" : "hidden")};
  background-color: ${(props) => (props.primary ? "#448569" : "#D9D9D9")};
`;

const PageContainer = styled.div`
  margin-top: 5px;
  width: 100%;
  flex-grow: 1;
`;
