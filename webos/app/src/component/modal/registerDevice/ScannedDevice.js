import styled from "styled-components"
import Signal from "../../../assets/icon/Signal.svg"

export const ScannedDevice = ({name, rssi, address, select, onClick}) => {
    return (
        <Container onClick={()=>{onClick(address)}} select = {select}>
            <Name>{name}</Name>
            <Rssi>
                <img src = {Signal}/>
                {rssi}dBm
            </Rssi>
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    height: 120px;
    background: #ebebeb;
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 15px;

    border: ${props => props.select ? "5px solid #000" : "none"};

    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Name = styled.span`
    width: 80%;
    font-size: 40px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

const Rssi = styled.span`
    font-size: 30px;

    & > img {
        margin-right: 15px;
    }
`;