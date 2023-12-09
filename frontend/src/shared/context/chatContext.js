import { createContext } from "react";

export const ChatContext = createContext({
  conversations: [],
  activeConversations: {},
  notifications: [],
  messages: [],
  files: [],
  setCurrentMessages: () => {},
  setSelectedFiles: () => {},
  sendMessages: () => {},
  setCurrentConversation: () => {},
  setConversation: () => {},
  updateMessagesAndConversations: () => {},
});
