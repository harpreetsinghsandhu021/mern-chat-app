import { useContext, useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import Messages from "../components/Messages";
import { ChatContext } from "../shared/context/chatContext";
import { AuthContext } from "../shared/context/authContext";
import { SocketContext } from "../shared/context/socketContext";
import { useHttpClient } from "../shared/hooks/httpHook";
import {
  checkOnlineStatus,
  getConversationId,
  getConversationName,
  getConversationPicture,
} from "../utils/chat";
import Call from "../components/Call";
import Peer from "simple-peer";

const callData = {
  socketId: null,
  receiveingCall: false,
  callEnded: false,
  name: null,
  photo: null,
  signal: null,
};
function Home() {
  const authCtx = useContext(AuthContext);
  const chatCtx = useContext(ChatContext);
  const socketCtx = useContext(SocketContext);

  const containerRef = useRef();

  const { socket } = socketCtx;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [call, setCall] = useState(callData);
  const [stream, setStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [makeCall, setMakeCall] = useState(false);
  const [typing, setTyping] = useState(null);
  const userVideo = useRef();
  const connectionRef = useRef();
  const myVideo = useRef();

  const fetchMessages = async () => {
    const fetchcurrentConversationMessages = await sendRequest(
      `${process.env.REACT_APP_API_URL}/messages/${chatCtx.activeConversations._id}?page=1&limit=10`,
      "GET",
      null,
      {
        Authorization: `Bearer ${authCtx.token}`,
      }
    );

    if (fetchcurrentConversationMessages.status === 200) {
      console.log(fetchcurrentConversationMessages.data);

      chatCtx.setCurrentMessages(fetchcurrentConversationMessages.data);
    }
  };

  const callUser = async () => {
    setMakeCall(true);
    const res = await setUpMedia();
    enableMedia(res);
    setCall({
      ...call,
      name: getConversationName(
        authCtx.userId,
        chatCtx.activeConversations.users
      ),
      photo: getConversationPicture(
        authCtx.userId,
        chatCtx.activeConversations.users
      ),
    });

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("call user", {
        userToCall: getConversationId(
          authCtx.userId,
          chatCtx.activeConversations.users
        ),
        signal: data,
        from: call.socketId,
        callerId: authCtx.userId,
      });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.on("answer call", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    connectionRef.current = peer;
  };

  function answerCall() {
    enableMedia();
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answer call", { signal: data, to: call.socketId });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    peer.signal(call.signal);
    connectionRef.current = peer;
  }

  useEffect(() => {
    socket.on("setup socket", (id) => {
      setCall({ ...call, socketId: id });
    });
    socket.on("call user", (data) => {
      setCall({
        ...call,
        socketId: data.from,
        name: data.name,
        photo: data.photo,
        signal: data.signal,
        receiveingCall: true,
      });
    });
  }, []);

  function setUpMedia() {
    return new Promise((res, rej) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
          res(stream);
        });
    });
  }

  function enableMedia(stream) {
    myVideo.current.srcObject = stream;
  }

  useEffect(() => {
    if (chatCtx.activeConversations._id) {
      fetchMessages();
    }
  }, [chatCtx.activeConversations]);

  useEffect(() => {
    socket.emit("join", authCtx.userId);
    socket.on("get-online-users", (users) => {
      setOnlineUsers(users);
    });
    socket.on("typing", (conversation) => setTyping(conversation));
    socket.on("stop typing", () => setTyping(false));
  }, [authCtx.userId]);

  function messageListener(message) {
    chatCtx.updateMessagesAndConversations(message);
  }
  useEffect(() => {
    socket.on("recieve message", (message) => {
      console.log(message);

      if (message._id) {
        messageListener(message);
      }
    });

    return () => {
      socket.off("recieve message");
    };
  }, [
    socket,
    chatCtx.activeConversations._id,
    chatCtx.messages,
    chatCtx.conversations,
  ]);

  return (
    <div className="flex chat--container">
      <Sidebar typing={typing} onlineUsers={onlineUsers} />
      {chatCtx.activeConversations._id ? (
        <Messages
          callUser={callUser}
          loading={isLoading}
          online={
            chatCtx.activeConversations.isGroup
              ? false
              : checkOnlineStatus(
                  onlineUsers,
                  authCtx.userId,
                  chatCtx.activeConversations.users
                )
          }
        />
      ) : (
        <Messages noConversation />
      )}
      <Call
        makeCall={makeCall}
        setMakeCall={setMakeCall}
        call={call}
        setCall={setCall}
        stream={stream}
        userVideo={userVideo}
        myVideo={myVideo}
        answerCall={answerCall}
        callAccepted={callAccepted}
      />
    </div>
  );
}

export default Home;
