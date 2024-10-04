import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { readLatestValue } from "../../api/coapService";
import edit from "../../assets/icon/edit.svg"
import trash from "../../assets/icon/trash.svg"
import arrowRight from "../../assets/icon/arrowRight.png";
import { AreaInfoInput } from "../modal/AreaInfoInput";
import { CheckDelete } from "../modal/CheckDelete";

export const DeviceValueBox = ({ device, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { _id, name, unit } = device;
  const [value, setValue] = useState("X");
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(()=> {
    readLatestValue(_id, (result) => {
      setValue(`${result.value}${unit}`);
    })
  }, []);

  console.log("devices : ", device);
  return (
    <Container>
      <CheckDelete show = {showDelete}
                   setShow={setShowDelete}
                   onDelete={()=>{onDelete(_id)}} />
      <AreaInfoInput show={showEdit} onSubmit={onEdit}
                     setShow={setShowEdit}
                     title={"기기 수정"} target={"기기"}/>
      <RowWrapper>
        <Title>{name}</Title>
        <img src={arrowRight} width={80} height={80} onClick={() => {navigate(`/detail/${_id}`)}}/>
      </RowWrapper>
      
      <RowWrapper>
        <Value>{value}</Value>
        <ButtonWrapper>
          <img src={edit} width={60} height={60} onClick={()=>{setShowEdit(true)}}/>
          <img src={trash} width={60} height={60} onClick={()=>{setShowDelete(true)}}/>
        </ButtonWrapper>
      </RowWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  border-radius: 40px;
  text-align: left;
  justify-content: flex-start;
  padding: 30px;
`;

const Title = styled.div`
  font-size: 55px;
  color: #4c4c4c;
  width: 100%;
  text-overflow: ellipsis;
  overflox: hidden;
`
const Value = styled.div`
  font-size: 80px;
  color: #4c4c4c;
  width: 100%;
  text-overflow: ellipsis;
  overflox: hidden;
`
const RowWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  & >  * {
    margin-left : 30px;
  }
`;