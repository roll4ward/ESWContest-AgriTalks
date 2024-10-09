import styled from "styled-components";
import LoadingIcon from "./LoadingIcon";
import { ScannedDevice } from "./ScannedDevice";
import { useEffect, useState } from "react";

export const SelectDevice = () => {
    const [scannedDevice, setScannedDevice] = useState([
        new DeviceInfo("준희", "주소1", -70),
        new DeviceInfo("준희", "주소2", -70),
        new DeviceInfo("준희", "주소3", -70),
        new DeviceInfo("준희", "주소4", -70),
    ]);

    const [selected, setSelected] = useState("");

    function DeviceInfo (name, address, rssi){
        this.name = name;
        this.address = address;
        this.rssi = rssi;
    }
    
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
                {
                    scannedDevice.map(({name, rssi, address})=> 
                        (<ScannedDevice
                            onClick={setSelected}
                            address={address} 
                            name={name}
                            rssi={rssi}
                            select={address === selected}/>))
                }
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
    background: #FFFFFF;
    width: 100%;
    height: 400px;
    flex-grow: 1;
    border-radius: 25px;
    overflow-y: auto;
    padding: 0 20px;
`;