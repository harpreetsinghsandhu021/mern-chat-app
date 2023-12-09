import React, { useContext, useRef, useState } from "react";
import classes from "../styles/Sidebar.module.css";
import { Input } from "rsuite";
import Settingsbar from "./Settingsbar";
import { useEffect } from "react";
import { ChatContext } from "../shared/context/chatContext";
import Conversation from "./Conversation";
import { Loader } from "rsuite";
import { AuthContext } from "../shared/context/authContext";
import { useHttpClient } from "../shared/hooks/httpHook";
import { checkOnlineStatus } from "../utils/chat";
import ProfileSettings from "./ProfileSettings";

const Sidebar = (props) => {
  const chatCtx = useContext(ChatContext);
  const authCtx = useContext(AuthContext);

  const [filteredUsers, setFilteredUsers] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const profileSettingsRef = useRef();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  async function getAllConversations() {
    const response = await sendRequest(
      `${process.env.REACT_APP_API_URL}/conversation`,
      "GET",
      null,
      { Authorization: `Bearer ${authCtx.token}` }
    );

    if (response.status === 200) {
      chatCtx.setConversation(response.data);

      setFilteredUsers(response.data);
    }
  }

  async function handleSearchUsers(e) {
    if (e.key === "Enter") {
      const fetchSearchedUsers = await sendRequest(
        `${process.env.REACT_APP_API_URL}/users?name=${e.target.value}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${authCtx.token}`,
        }
      );

      if (fetchSearchedUsers.status === 200) {
        let searchResults = fetchSearchedUsers.data.data;

        searchResults = searchResults.filter(
          (result) => result._id !== authCtx.userId
        );

        setSearchResults(searchResults);
      }
    }
  }

  function handleFilterUsers(e) {
    const localCopy = [...filteredUsers];

    if (e.target.value.length === 0) {
      setSearchResults([]);
    }

    const filteredData = localCopy.filter((user) => {
      if (
        user.name.startsWith(e.target.value) ||
        user.name.includes(e.target.value)
      ) {
        return user;
      }
    });

    chatCtx.setConversation(filteredData);
  }

  useEffect(() => {
    getAllConversations();
  }, []);

  return (
    <aside className={classes.sidebar}>
      <ProfileSettings targetRef={profileSettingsRef} />
      <Settingsbar targetRef={profileSettingsRef} />
      <div className={classes.filter__input__wrapper}>
        <input
          onChange={handleFilterUsers}
          onKeyDown={handleSearchUsers}
          className="input--wd--full"
          placeholder="Search or Start New Chat"
        />
      </div>
      <ul className={classes.users__list}>
        {!isLoading &&
          chatCtx.conversations.length === 0 &&
          searchResults.length === 0 && (
            <div className="center mt-2">
              <p>No matches found</p>{" "}
            </div>
          )}
        {isLoading ? (
          <div className="bg-white center mt-2">
            <Loader loading={isLoading} />
          </div>
        ) : (
          <>
            {chatCtx.conversations.length > 0 &&
              chatCtx.conversations
                .filter(
                  (c) =>
                    c.latestMessage || c._id === chatCtx.activeConversations._id
                )
                .map((conv) => {
                  let check = checkOnlineStatus(
                    props.onlineUsers,
                    authCtx.userId,
                    conv.users
                  );

                  return (
                    <Conversation
                      typing={props.typing}
                      online={!conv.isGroup && check ? true : false}
                      convo={conv}
                      key={conv._id}
                    />
                  );
                })}
          </>
        )}
        {searchResults.length > 0 && (
          <>
            <h5 className="p-1">Contacts</h5>
            {searchResults.map((result) => {
              return (
                <Conversation
                  type="searchResult"
                  result={result}
                  key={result._id}
                />
              );
            })}
          </>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
