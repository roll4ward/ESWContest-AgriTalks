import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const TimerWrapper = styled.div`
  font-size: 1.5rem;
  text-align: center;
  margin: 10px 0 20px;
`;

const Timer = ({ isRunning, onReset }) => {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  useEffect(() => {
    if (onReset) {
      setSeconds(0);
    }
  }, [onReset]);

  const formatTime = (time) => time.toString().padStart(2, "0");

  return (
    <TimerWrapper>
      {`${formatTime(Math.floor(seconds / 60))}:${formatTime(seconds % 60)}`}
    </TimerWrapper>
  );
};

export default Timer;