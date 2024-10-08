import styled from "styled-components";
import LoadingIcon from "./LoadingIcon";
import { ScannedDevice } from "./ScannedDevice";

export const SelectDevice = () => {
    
    return (
        <Container>
            <Notice>
                <span>추가할 기기를 선택해주세요.</span>
                <Scanning>
                    <span>기기 스캔 중..</span>
                    <LoadingIcon/>
                </Scanning>
            </Notice>
            <DeviceSelectBox>
                <ScannedDevice select = "true" name = {"준희"} rssi = {-70}></ScannedDevice>
                <ScannedDevice name = {"준희"} rssi = {-70}></ScannedDevice>
            </DeviceSelectBox>
        </Container>
    );
}

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Notice = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 40px;
    margin-bottom: 10px;
`;

const Scanning = styled.div`
    & :nth-child(1) {
        margin-right: 20px;
    }
`;

const DeviceSelectBox = styled.div`
    background: #d9d9d9;
    width: 100%;
    flex-grow: 1;
    border-radius: 25px;
    overflow-y: auto;
    padding: 40px;
`;