import styled from "styled-components";
import LoadingIcon from "./LoadingIcon";
import { ScannedDevice } from "./ScannedDevice";
import { useEffect, useState } from "react";
import { startBLEScan } from "../../../api/newDevice";

export const SelectDevice = ({address, show}) => {
    const [scannedDevice, setScannedDevice] = useState([]);

    const [selected, setSelected] = useState("");

    useEffect(()=> {
        if (show){
            startBLEScan((results)=>{
                setScannedDevice(results);
                console.log(results);
            });
            console.log("call scan");
        }
        else {
            setScannedDevice([]);
        }
    }, []);

    useEffect(()=> {
        if (!scannedDevice.some(({address})=> address === selected)) setSelected("");
    }, [scannedDevice]);

    useEffect(()=>{
        address.current = selected;
    }, [selected]);
    
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