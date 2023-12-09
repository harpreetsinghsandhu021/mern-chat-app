import React, { useContext } from "react";
import classes from "../styles/Sidebar.module.css";
import { formatDate } from "../utils/date";
import {
  getConversationId,
  getConversationName,
  getConversationPicture,
} from "../utils/chat";
import { AuthContext } from "../shared/context/authContext";
import { useHttpClient } from "../shared/hooks/httpHook";
import { ChatContext } from "../shared/context/chatContext";
import { SocketContext } from "../shared/context/socketContext";

const Conversation = (props) => {
  const authCtx = useContext(AuthContext);
  const chatCtx = useContext(ChatContext);
  const socketCtx = useContext(SocketContext);
  const { socket } = socketCtx;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const el = document.getElementById("chats-container");

  async function handleCreateConversation(currentConversation) {
    const recieverId = getConversationId(
      authCtx.userId,
      currentConversation.users
    );

    try {
      const createConversation = await sendRequest(
        `${process.env.REACT_APP_API_URL}/conversation`,
        "POST",
        JSON.stringify({
          recieverId: recieverId,
        }),
        {
          Authorization: `Bearer ${authCtx.token}`,
          "Content-Type": "application/json",
        }
      );

      chatCtx.setCurrentConversation(createConversation.data);
      chatCtx.setSelectedFiles(null);
      socket.emit("join conversation", createConversation.data._id);
      // socket.emit("join conversation", createConversation.data._id);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleCreateConversationForNewUsers(user) {
    try {
      const createConversation = await sendRequest(
        `${process.env.REACT_APP_API_URL}/conversation`,
        "POST",
        JSON.stringify({
          recieverId: user._id,
        }),
        {
          Authorization: `Bearer ${authCtx.token}`,
          "Content-Type": "application/json",
        }
      );

      chatCtx.setCurrentConversation(createConversation.data);
      chatCtx.setSelectedFiles(null);
      socket.emit("join conversation", createConversation.data._id);
    } catch (err) {
      console.log(err);
    }
  }

  if (props.type === "searchResult") {
    return (
      <li
        onClick={() => handleCreateConversationForNewUsers(props.result)}
        className={`${classes.user__card} `}
      >
        <div className={classes.user__img__wrap}>
          {props.result.photo ? (
            <img
              crossorigin="anonymous"
              src={`${process.env.REACT_APP_IMAGE_URL}/img/users/${props.result.photo}`}
            />
          ) : (
            <img src="/default.jpg" alt="default-user" />
          )}
        </div>
        <div className={classes.user__info}>
          <h5>{props.result.name}</h5>
          <p className="clr-gry">
            {props.result.status
              ? props.result.status
              : "Hey there ! I am using whatsapp"}
          </p>
        </div>
      </li>
    );
  }

  return (
    <li
      onClick={() => handleCreateConversation(props.convo)}
      className={`${classes.user__card} ${
        props.convo._id === chatCtx.activeConversations._id
          ? classes.active
          : classes.unactive
      }`}
    >
      <div className={classes.user__img__wrap}>
        {props.online && <div className={classes.status}></div>}
        {props.convo.photo ? (
          <img
            crossorigin="anonymous"
            src={`${process.env.REACT_APP_IMAGE_URL}/img/users/${
              props.convo.isGroup
                ? props.convo.photo
                : getConversationPicture(authCtx.userId, props.convo.users)
            }`}
          />
        ) : (
          <img src="/default.jpg" alt="default-user" />
        )}
      </div>
      <div className={classes.user__info}>
        <h5>
          {props.convo.isGroup
            ? props.convo.name
            : getConversationName(authCtx.userId, props.convo.users)}{" "}
        </h5>
        {props.typing === props.convo._id ? (
          <p className="clr-gry"> Typing... </p>
        ) : (
          <>
            <p className="clr-gry">
              {props.convo.latestMessage.message
                ? props.convo.latestMessage.message
                : props.convo.latestMessage.files.includes(".mp4")
                ? "video"
                : props.convo.latestMessage.files.includes(".jpeg")
                ? "photo"
                : props.convo.latestMessage.sender.status}
            </p>
          </>
        )}
      </div>
      <div className={classes.last__active_time}>
        <p>
          {props.convo.latestMessage
            ? formatDate(props.convo.latestMessage.createdAt)
            : ""}
        </p>
      </div>
    </li>
  );
};

export default Conversation;
