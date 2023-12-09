import React, { useState, useEffect, useContext } from "react";
import classes from "../styles/ProfileSettings.module.css";
import { BiArrowBack } from "react-icons/bi";
import { useToaster, Input, InputGroup } from "rsuite";
import AvatarIcon from "@rsuite/icons/legacy/Avatar";
import { AuthContext } from "../shared/context/authContext";
import { useHttpClient } from "../shared/hooks/httpHook";
import { useRef } from "react";
function previewFile(file, callback) {
  const reader = new FileReader();
  reader.onloadend = () => {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
}
const ProfileSettings = (props) => {
  const authCtx = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const toaster = useToaster();
  const uploaderRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  function handleProfileSettingsToggle() {
    props.targetRef.current.classList.remove("animate-in");
  }

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

  return (
    <div ref={props.targetRef} className={classes.profile__settings__wrapper}>
      <header>
        <div className={classes.inner__header}>
          <BiArrowBack onClick={handleProfileSettingsToggle} /> Profile
        </div>
      </header>
      <div className={classes.user__settings}>
        <button
          onClick={() => uploaderRef.current.click()}
          className={classes.uploader__btn}
        >
          {user && user.photo && (
            <img
              crossorigin="anonymous"
              src={`${process.env.REACT_APP_IMAGE_URL}/img/users/${user.photo}`}
            />
          )}
          <input
            accept=".png,.jpg,.jpeg"
            ref={uploaderRef}
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            hidden
          />
        </button>
        <div className={classes.input__wrap}>
          <label htmlFor="name">name</label>

          <InputGroup
            inside
            style={{
              margin: "1rem 0",
              border: "none",
            }}
          >
            {user && <Input defaultValue={user.name} id="name" type="text" />}
          </InputGroup>
        </div>
        <div className={classes.input__wrap}>
          <label htmlFor="status">status</label>

          <InputGroup
            inside
            style={{
              margin: "1rem 0",
              border: "none",
            }}
          >
            {user && (
              <Input defaultValue={user.status} id="status" type="text" />
            )}
          </InputGroup>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
