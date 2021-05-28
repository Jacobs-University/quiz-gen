import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { STATUS } from "../constants";
import "../css/timer.css";

const Timer = (props) => {
  const { finish, setStatus, status } = props;
  const duration = useMemo(() => props.duration * 1000, [props.duration]);
  const [startTime, setStartTime] = useState();
  const [millisecondsLeft, setMillisecondsLeft] = useState(duration);
  const interval = useRef();
  const start = () => {
    if (status === STATUS.ONGOING) return;
    setStatus(STATUS.ONGOING);
    setStartTime(Date.now());
  };
  const end = useCallback(() => {
    if (interval.current) clearInterval(interval.current);
    if (status === STATUS.ONGOING) setStatus(STATUS.COMPLETED);
    finish();
  }, [status, finish, setStatus]);
  useEffect(() => {
    if (status === STATUS.ONGOING && startTime)
      interval.current = window.setInterval(() => {
        const difference = Math.max(startTime - Date.now() + duration, 0);
        setMillisecondsLeft(difference);
        if (difference === 0) end();
      }, 1000);
    return () => clearInterval(interval.current);
  }, [startTime, status, duration, end]);
  return (
    <div className="Timer">
      <div className="Timer-time">
        {startTime ? "Time Left" : "Duration"}{" "}
        {formatDuration(millisecondsLeft)}
      </div>
      {status !== STATUS.ONGOING ? (
        <div className="Timer-start" onClick={start}>
          Start Quiz
        </div>
      ) : (
        <div className="Timer-end" onClick={end}>
          End Quiz
        </div>
      )}
    </div>
  );
};

const formatDuration = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000) % 60;
  const minutes = Math.floor(milliseconds / 60000) % 60;
  const hours = Math.floor(milliseconds / 3600000) % 24;
  return print(hours) + print(minutes, hours) + print(seconds, minutes, false);
};

const print = (number, minimum = false, colon = true) =>
  number || colon || minimum
    ? number.toLocaleString("de-DE", {
        maximumIntegerDigits: 2,
        minimumIntegerDigits: minimum ? 2 : 1,
        maximumFractionDigits: 0,
      }) + (colon && number ? ":" : "")
    : "";
export default Timer;
