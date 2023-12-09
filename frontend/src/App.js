import logo from "./logo.svg";
import "./App.css";
import Sidebar from "./components/Sidebar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthContext } from "./shared/context/authContext";
import { SocketContext, socket } from "./shared/context/socketContext";
import { useAuth } from "./shared/hooks/authHook";
import { ChatContext } from "./shared/context/chatContext";
import { useChat } from "./shared/hooks/chatHook";

// pages
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";

function App() {
  const { token, login, logout, userId } = useAuth();
  const {
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
  } = useChat();

  const routes = (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <>
                <SocketContext.Provider value={{ socket: socket }}>
                  <Home />
                </SocketContext.Provider>
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
          exact
        />
        <Route
          path="/signup"
          element={token ? <Navigate to="/" /> : <SignUp signup />}
          exact
        />
        <Route
          path="/login"
          element={token ? <Navigate to="/" /> : <SignUp login />}
          exact
        />
      </Routes>
    </Router>
  );
  return (
    <>
      <ChatContext.Provider
        value={{
          messages: messages,
          setCurrentMessages: setCurrentMessages,
          conversations: conversations,
          activeConversations: activeConversations,
          notifications: notifications,
          setCurrentConversation: setCurrentConversation,
          setConversation: setConversation,
          sendMessages: sendMessages,
          updateMessagesAndConversations: handleUpdateMessagesAndConversations,
          files: files,
          setSelectedFiles: setSelectedFiles,
        }}
      >
        <AuthContext.Provider
          value={{
            isLoggedIn: !!token,
            token: token,
            userId: userId,
            login: login,
            logout: logout,
          }}
        >
          <main className="center">{routes}</main>
        </AuthContext.Provider>
      </ChatContext.Provider>
    </>
  );
}

export default App;
