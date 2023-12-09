import { setCookie } from "cookies-next";
import { useState } from "react";
import { useHttpClient } from "./httpHook";
import sound from "../../assets/audio/notification.mp3";

export const useChat = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [activeConversations, setActiveConversations] = useState({});
  const [conversations, setConversations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState([]);

  function setCurrentConversation(data) {
    setActiveConversations(data);
    setCookie("activeConv", data._id);
  }

  function setConversation(data) {
    setConversations(data);
  }

  function setSelectedFiles(data) {
    if (data === null) {
      setFiles([]);
    } else {
      setFiles((prevFiles) => [...prevFiles, data]);
    }
  }

  async function sendMessages(convoId, message, token) {
    const imageFilteredFiles = files.filter(
      (file) => file.type !== "video/mp4" && file.type !== "doc"
    );
    const videoFilteredFiles = files.filter(
      (file) => file.type === "video/mp4"
    );

    const documentFilteredFiles = files.filter((file) => file.type === "doc");

    const formData = new FormData();

    formData.append("conversationId", convoId);
    formData.append("message", message);

    imageFilteredFiles.map((file) => formData.append("images", file.file));
    videoFilteredFiles.map((file) => formData.append("videos", file.file));
    documentFilteredFiles.map((file) =>
      formData.append("documents", file.file)
    );

    try {
      const sendMessageRequest = await sendRequest(
        `${process.env.REACT_APP_API_URL}/messages`,
        "POST",
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (sendMessageRequest.status === 201) {
        setFiles([]);
        setMessages((prevMessages) => [
          ...prevMessages,
          sendMessageRequest.data,
        ]);

        let conversation = {
          ...sendMessageRequest.data.conversation,
          latestMessage: sendMessageRequest.data,
        };

        let newConvos = [...conversations].filter(
          (c) => c._id !== activeConversations._id
        );

        newConvos.unshift(conversation);

        setConversations(newConvos);

        return sendMessageRequest;
      }
    } catch (err) {
      console.log(err);
    }
  }

  function setCurrentMessages(data) {
    setMessages(data);
  }

  function playNotificationSound() {
    const audio = new Audio(sound);
    audio.play();
  }

  function handleUpdateMessagesAndConversations(data) {
    if (data.conversation._id === activeConversations._id) {
      setMessages((prevMessages) => [...prevMessages, data]);
      playNotificationSound();
    }

    let conversation = {
      ...data.conversation,
      latestMessage: data,
    };

    if (conversation._id !== activeConversations._id) {
      let newConvos = [...conversations].filter(
        (c) => c._id !== conversation._id
      );
      newConvos.unshift(conversation);

      setConversations(newConvos);
      playNotificationSound();
    } else {
      if (conversations.length < 1) return;

      let newConvos = [...conversations].filter(
        (c) => c._id !== activeConversations._id
      );

      newConvos.unshift(conversation);
      setConversations(newConvos);
    }
  }
  return {
    messages,
    setCurrentMessages,
    conversations,
    activeConversations,
    notifications,
    setCurrentConversation,
    setConversation,
    sendMessages,
    handleUpdateMessagesAndConversations,
    files,
    setSelectedFiles,
  };
};
