import React, { useEffect, useRef, useState } from "react";
import classes from "../styles/Call.module.css";
import { ImCross } from "react-icons/im";
import { BsFillTelephoneFill } from "react-icons/bs";

import sound from "../assets/audio/ringtone.mp3";

const Ringing = (props) => {
  const { receiveingCall, callEnded, name, photo } = props.call;
  const [timer, setTimer] = useState(0);

  let interval;

  const handleTimer = () => {
    interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
  };

  useEffect(() => {
    if (timer < 30) {
      handleTimer();
    } else {
      props.setCall({ ...props.call, receiveingCall: false });
    }

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className={classes.ringing__notification}>
      <div className="flex">
        <img
          crossorigin="anonymous"
          src={`${process.env.REACT_APP_IMAGE_URL}/img/users/${photo}`}
        />
        <div className={classes.user__cnt}>
          <h5>{name}</h5>
          <p>Whatsapp Video ...</p>
        </div>
        <button className={classes.btn__cncl}>
          <ImCross />
        </button>
        <button onClick={() => props.answerCall()} className={classes.btn__accept}>
          <BsFillTelephoneFill />
        </button>
      </div>
      <audio hidden loop autoPlay controls>
        <source src={sound} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default Ringing;
