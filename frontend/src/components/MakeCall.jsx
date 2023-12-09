import React from "react";
import classes from "../styles/MakeCall.module.css";
import { BiLeftArrow } from "react-icons/bi";
import { IoPersonAdd } from "react-icons/io5";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { BsFillCameraVideoFill, BsFillMicMuteFill } from "react-icons/bs";
import { useState } from "react";
import { useContext } from "react";
import { getConversationName } from "../utils/chat";
import { AuthContext } from "../shared/context/authContext";
import { ChatContext } from "../shared/context/chatContext";

const MakeCall = (props) => {
  const authCtx = useContext(AuthContext);
  const chatCtx = useContext(ChatContext);

  const [showControls, setShowControls] = useState(false);
  const { receiveingCall, callEnded, name, photo } = props.call;
  return (
    <>
      <div
        onMouseOver={() => setShowControls(true)}
        onMouseOut={() => setShowControls(false)}
        className={`${classes.call__actions} `}
      >
        <header className={classes.call__header}>
          <button>
            <BiLeftArrow />
          </button>

          <button>
            <IoPersonAdd />
          </button>
        </header>
        <div className={classes.call__cnt}>
          <h4>
            {getConversationName(
              authCtx.userId,
              chatCtx.activeConversations.users
            )}
          </h4>
          <p>Ringing...</p>
          <div className={classes.video__cnt}>
            {props.callAccepted && !callEnded ? (
              <div>
                <video
                  ref={props.userVideo}
                  playsInline
                  muted
                  autoPlay
                  className={classes.large__video}
                ></video>
              </div>
            ) : null}
            <div>
              <video
                ref={props.myVideo}
                playsInline
                muted
                autoPlay
                className={`${classes.small__video} ${
                  showControls ? classes.move__up : ""
                }`}
              ></video>
            </div>
          </div>
        </div>
        {showControls && (
          <div className={classes.call__controls}>
            <div className="flex">
              <button>
                <HiMiniSpeakerWave />
              </button>
              <button>
                <BsFillCameraVideoFill />
              </button>
              <button>
                <BsFillMicMuteFill />
              </button>
              <button>
                <img src="/hang.svg" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MakeCall;
