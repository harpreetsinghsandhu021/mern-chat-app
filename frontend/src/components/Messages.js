import React, { useContext, useEffect, useRef, useState } from "react";
import classes from "../styles/Messages.module.css";
import { IconButton } from "rsuite";
import SendIcon from "@rsuite/icons/Send";
import { ChatContext } from "../shared/context/chatContext";
import { AuthContext } from "../shared/context/authContext";
import { SocketContext } from "../shared/context/socketContext";

import { AiOutlineSearch } from "react-icons/ai";
import { BsThreeDotsVertical, BsFillTelephoneFill } from "react-icons/bs";
import EmojiPickerApp from "./EmojiPicker";
import Attachments from "./Attachments";
import { useHttpClient } from "../shared/hooks/httpHook";
import { getConversationName, getConversationPicture } from "../utils/chat";

import Message from "./Message";
import FilePreviewer from "./FilePreviewer";

const Messages = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const chatCtx = useContext(ChatContext);
  const authCtx = useContext(AuthContext);
  const socketCtx = useContext(SocketContext);
  const [page, setPage] = useState(2);

  const { socket } = socketCtx;

  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const textRef = useRef();
  const endElRef = useRef();
  const startRef = useRef();
  const chatsContainerRef = useRef();

  async function handleMessageSubmit(e) {
    e.preventDefault();

    try {
      const res = await chatCtx.sendMessages(
        chatCtx.activeConversations._id,
        message,
        authCtx.token
      );

      socket.emit("send message", res.data);

      setMessage(" ");
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (page > 2) return;
    if (textRef.current) {
      textRef.current.focus();
    }
    if (endElRef.current) {
      endElRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [chatCtx.messages]);

  function handleMessageInputChange(e) {
    setMessage(e.target.value);

    if (!typing) {
      setTyping(true);
      socket.emit("typing", chatCtx.activeConversations._id);
    }
    let lastTypingTime = new Date().getTime();
    let timer = 1000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timer && typing) {
        socket.emit("stop typing", chatCtx.activeConversations._id);
        setTyping(false);
      }
    }, timer);
  }

  const fetchMessages = async () => {
    const fetchcurrentConversationMessages = await sendRequest(
      `${process.env.REACT_APP_API_URL}/messages/${chatCtx.activeConversations._id}?page=${page}&limit=10`,
      "GET",
      null,
      {
        Authorization: `Bearer ${authCtx.token}`,
      }
    );

    if (fetchcurrentConversationMessages.status === 200) {
      console.log(fetchcurrentConversationMessages.data);
      console.log([
        ...fetchcurrentConversationMessages.data,
        ...chatCtx.messages,
      ]);

      chatCtx.setCurrentMessages([
        ...fetchcurrentConversationMessages.data,
        ...chatCtx.messages,
      ]);
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div
      className={`${
        props.noConversation ? classes.plain__bg : classes.message__wrapper
      }`}
    >
      {!props.noConversation ? (
        <>
          <header className={classes.header}>
            <div className={`flex ${classes.inner__header} `}>
              {chatCtx.activeConversations.photo ? (
                <img
                  crossorigin="anonymous"
                  src={`${process.env.REACT_APP_IMAGE_URL}/img/users/${
                    chatCtx.activeConversations.isGroup
                      ? chatCtx.activeConversations.photo
                      : getConversationPicture(
                          authCtx.userId,
                          chatCtx.activeConversations.users
                        )
                  }`}
                />
              ) : (
                <img src="/default.jpg" alt="default-user" />
              )}
              <p>
                <span className={classes.user__name}>
                  {chatCtx.activeConversations.isGroup
                    ? chatCtx.activeConversations.name
                    : getConversationName(
                        authCtx.userId,
                        chatCtx.activeConversations.users
                      )}
                </span>
                {props.loading ? (
                  <span>Loading messages...</span>
                ) : (
                  <span> {props.online ? "Online" : ""} </span>
                )}
              </p>
              <div className={`flex ${classes.rght}`}>
                <BsFillTelephoneFill onClick={props.callUser} />
                <AiOutlineSearch />
                <BsThreeDotsVertical />
              </div>
            </div>
          </header>

          {chatCtx.files.length > 0 ? (
            <FilePreviewer />
          ) : (
            <div
              id="chats-container"
              onScroll={(e) => {
                if (chatsContainerRef.current.scrollTop !== 0) return;
                if (chatsContainerRef.current.scrollTop === 0) {
                  fetchMessages();
                }
              }}
              ref={chatsContainerRef}
              className={classes.chat}
            >
              {!props.loading &&
                chatCtx.messages.map((message) => (
                  <Message
                    key={message._id}
                    me={authCtx.userId === message.sender._id}
                    message={message}
                  />
                ))}

              <div ref={endElRef}></div>
            </div>
          )}

          <form
            onSubmit={(e) => e.preventDefault()}
            className={`flex  ${classes.actions__wrapper}`}
          >
            <EmojiPickerApp
              textRef={textRef}
              message={message}
              setMessage={setMessage}
            />
            <Attachments />
            <input
              value={message}
              onChange={(e) => handleMessageInputChange(e)}
              className="input--wd--full"
              placeholder="Type a message"
              ref={textRef}
            />
            <IconButton
              className={classes.send__btn}
              size="lg"
              type="submit"
              onClick={handleMessageSubmit}
              icon={<SendIcon className={classes.send__btn_icon} />}
            />
          </form>
        </>
      ) : (
        <div className={classes.opening__txt}>
          <img src="/home-bg.png" />
          <h2>Chat Web</h2>
          <h6 className="mt-1 ">
            Send and recieve messages with this incredible chat app{" "}
          </h6>
        </div>
      )}
    </div>
  );
};

export default Messages;
