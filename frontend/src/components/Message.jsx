import React, { useContext } from "react";
import classes from "../styles/Message.module.css";
import { PiTriangleFill } from "react-icons/pi";
import moment from "moment";
import { SocketContext } from "../shared/context/socketContext";
import { ChatContext } from "../shared/context/chatContext";
import FileMessage from "./FileMessage";
import FileOthers from "./FileOthers";

const Message = (props) => {
  const chatCtx = useContext(ChatContext);
  const socketCtx = useContext(SocketContext);

  return (
    <div
      className={`${classes.message} ${props.me ? classes.rght : classes.left}`}
    >
      <div className={classes.inner__message}>
        <div className={classes.msg__cnt}>
          {props.message.files.length > 0
            ? props.message.files.map((file) => {
                return (
                  <>
                    {typeof file !== "object" &&
                    (file.includes(".mp4") || file.includes(".jpeg")) ? (
                      <FileMessage
                        fileMessage={file}
                        message={props.message}
                        key={props.message._id}
                        me={props.me}
                      />
                    ) : (
                      <FileOthers
                        file={file}
                        message={props.message}
                        key={props.message._id}
                        me={props.me}
                      />
                    )}
                  </>
                );
              })
            : null}

          <span>{props.message.message}</span>
        </div>
        <span className={classes.msg__details}>
          {moment(props.message.createdAt).format("HH:mm a")}
          <span>
            {props.me && props.message.status ? props.message.status : ""}
          </span>
        </span>
      </div>
    </div>
  );
};

export default Message;
