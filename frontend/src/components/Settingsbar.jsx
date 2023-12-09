import React, { useContext } from "react";
import classes from "../styles/Sidebar.module.css";
import { FaCircleUser } from "react-icons/fa6";
import { PiArrowsSplit, PiUsersThreeLight } from "react-icons/pi";
import { AiOutlineSync, AiFillMessage } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import CustomDropdown from "./Dropdown";
import { AuthContext } from "../shared/context/authContext";
import { useEffect } from "react";
import { useHttpClient } from "../shared/hooks/httpHook";
import { useState } from "react";

const Settingsbar = (props) => {
  const authCtx = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const user = await sendRequest(
        `${process.env.REACT_APP_API_URL}/users/${authCtx.userId}`
      );

      setUser(user.data.data);
    } catch (error) {}
  };
  useEffect(() => {
    fetchUser();
  }, [authCtx.token]);

  function handleProfileSettingsToggle() {
    props.targetRef.current.classList.add("animate-in");
  }

  return (
    <div className={`center ${classes.settings__bar}`}>
      <div className={classes.inner__settings__bar}>
        <div className={classes.profile}>
          {user ? (
            <img
              onClick={handleProfileSettingsToggle}
              crossorigin="anonymous"
              src={`${process.env.REACT_APP_IMAGE_URL}/img/users/${user.photo}`}
            />
          ) : (
            <FaCircleUser />
          )}
        </div>
        <div className={classes.settings__list}>
          <button className="toggle-btn">
            <PiUsersThreeLight />
          </button>
          <button className="toggle-btn">
            <AiOutlineSync />{" "}
          </button>
          <button className="toggle-btn">
            <AiFillMessage />{" "}
          </button>
          <button className="toggle-btn">
            <CustomDropdown icon={<BsThreeDotsVertical />} />{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settingsbar;
