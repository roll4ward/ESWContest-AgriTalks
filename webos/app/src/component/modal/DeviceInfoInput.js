import styled from "styled-components"
import { ModalBase } from "./ModalBase"
import { useEffect, useRef, useState } from "react"
import { createToast } from "../../api/toast";
import { readAllAreas } from "../../api/infomanageService";


export const DeviceInfoInput = ({show, setShow, onSubmit, title,
                                deviceName, deviceDescription, deviceArea}) => {
    const name = useRef({
        value: deviceName ? deviceName : ""
    });
    const description = useRef({
        value: deviceDescription ? deviceDescription : ""
    });
    const area = useRef({
        value: deviceArea ? deviceArea : ""
    });
    const [areas, setAreas] = useState([]);

    useEffect(()=> {
        readAllAreas((result) => {
            setAreas(result.map(area => ({ name: area.name, areaID: area.areaID })));
          })
    }, []);

    function onSubmitHandler() {
        if (!name.current.value) {
            createToast(`기기 이름을 입력해주세요!`);
            return;
        }

        if (!area.current.value) {
            createToast(`구역을 선택해주세요!`);
            return;
        }

        onSubmit(name.current.value, description.current.value, area.current.value);
        setShow(false);
    }

    return (
        <ModalBase show={show}>
            <Container>
                <Title>{title}</Title>
                <Label>{`기기 이름`}</Label>
                <Input defaultValue={deviceName} ref={name}></Input>
                <Label>{`기기 설명`}</Label>
                <Input defaultValue={deviceDescription} ref={description}></Input>
                <Label>{`구역`}</Label>
                <select name = "area" style = {{ width: "100%", height: "95px", fontSize: "50px", marginBottom: "20px" }}
                        defaultValue={deviceArea} ref = {area}>
                    { areas.map((area)=>(<option value={area.areaID}>{area.name}</option>)) }
                </select>
                <ButtonWrap>
                    <Button onClick={()=>{setShow(false)}}>취소</Button>
                    <Button primary onClick={onSubmitHandler}>확인</Button>
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
`;

const Label = styled.div`
    text-align: left;
    color: black;
    font-size: 50px;
    margin-bottom: 5px;
`;

const Input = styled.input`
    border-color: #448569;
    font-size: 50px;
    height: 95px;
    margin-bottom: 20px;
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


