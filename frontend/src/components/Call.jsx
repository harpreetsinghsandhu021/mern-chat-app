import React from "react";
import Ringing from "./Ringing";
import MakeCall from "./MakeCall";
import classes from "../styles/Call.module.css";

const Call = (props) => {
  const { receiveingCall, callEnded } = props.call;

  console.log(receiveingCall && !props.callAccepted);
  return (
    <>
      <div className={classes.call__wrapper}>
        {props.makeCall && (
          <MakeCall
            callAccepted={props.callAccepted}
            call={props.call}
            myVideo={props.myVideo}
            stream={props.stream}
            userVideo={props.userVideo}
          />
        )}
      </div>
      {receiveingCall && !props.callAccepted && (
        <Ringing
          answerCall={props.answerCall}
          call={props.call}
          setCall={props.setCall}
        />
      )}
    </>
  );
};

export default Call;
