import { useContext, useRef, useState } from "react";
import { Dropdown, IconButton, Button } from "rsuite";
import { AuthContext } from "../shared/context/authContext";
import { ChatContext } from "../shared/context/chatContext";
import mime from "mime";
import Uploader from "./Uploader.js";

export default function CustomDropdown(props) {
  const [active, setActive] = useState(false);
  const authCtx = useContext(AuthContext);
  const chatCtx = useContext(ChatContext);
  const uploadeDocumentRef = useRef();

  function button(propsInner, ref) {
    if (props.type === "filepicker") {
      <button
        type="reset"
        {...propsInner}
        ref={ref}
        icon={props.icon}
        className={`toggle-btn ${active ? "active--button" : ""}`}
        circle
        color="blue"
        appearance="primary"
      >
        {props.icon}
      </button>;
    }
    return (
      <button
        {...propsInner}
        ref={ref}
        type="reset"
        icon={props.icon}
        className={`toggle-btn ${active ? "active--button" : ""}`}
        circle
        color="blue"
        appearance="primary"
      >
        {props.icon}
      </button>
    );
  }

  function handleFileInputChange(e) {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      chatCtx.setSelectedFiles({
        file: file,
        type: "doc",
      });
    });
  }

  if (props.type === "filepicker") {
    return (
      <Dropdown
        onClickCapture={() => setActive((prevActive) => !prevActive)}
        menuStyle={{ width: 200, padding: "1rem 0" }}
        onClose={() => setActive(false)}
        placement="topStart"
        renderToggle={button}
      >
        <Dropdown.Item>
          <Uploader style={{ display: "none" }} />
        </Dropdown.Item>
        <Dropdown.Item>
          <svg
            width="20"
            height="19"
            viewBox="0 0 20 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.9999 13.04C8.16657 13.04 6.67479 11.5482 6.67479 9.71486C6.67479 7.88153 8.16657 6.38976 9.9999 6.38976C11.8332 6.38976 13.325 7.88153 13.325 9.71486C13.325 11.5482 11.8332 13.04 9.9999 13.04Z"
              fill="var(--attachment-type-camera-color)"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M14.606 1.6763C14.9347 2.23849 15.5121 2.60821 16.1634 2.60821H16.2429C18.3177 2.60821 20 4.29014 20 6.36531V14.8157C20 16.8902 18.3177 18.5725 16.2429 18.5725H3.7571C1.68226 18.5725 0 16.8902 0 14.8157V6.36531C0 4.29014 1.68226 2.60821 3.7571 2.60821H3.83661C4.48792 2.60821 5.06535 2.23849 5.39398 1.6763C5.98035 0.673833 7.06697 0 8.3126 0H11.6874C12.933 0 14.0193 0.673833 14.606 1.6763ZM9.9999 4.73333C7.25322 4.73333 5.01837 6.96818 5.01837 9.71486C5.01837 12.4615 7.25322 14.6964 9.9999 14.6964C12.7466 14.6964 14.9814 12.4615 14.9814 9.71486C14.9814 6.96818 12.7466 4.73333 9.9999 4.73333Z"
              fill="var(--attachment-type-camera-color)"
            ></path>
          </svg>
          camera
        </Dropdown.Item>
        <Dropdown.Item onClick={() => uploadeDocumentRef.current.click()}>
          <input
            onChange={handleFileInputChange}
            ref={uploadeDocumentRef}
            multiple
            type="file"
            accept="application/*,text/plain"
            hidden
          />
          <svg
            height="20"
            viewBox="0 0 16 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2 0C0.9 0 0.01 0.9 0.01 2L0 18C0 19.1 0.89 20 1.99 20H14C15.1 20 16 19.1 16 18V6.83C16 6.3 15.79 5.79 15.41 5.42L10.58 0.59C10.21 0.21 9.7 0 9.17 0H2ZM9 6V1.5L14.5 7H10C9.45 7 9 6.55 9 6ZM4 10C3.44772 10 3 10.4477 3 11C3 11.5523 3.44772 12 4 12H12C12.5523 12 13 11.5523 13 11C13 10.4477 12.5523 10 12 10H4ZM10 15C10 14.4477 9.55228 14 9 14H4C3.44772 14 3 14.4477 3 15C3 15.5523 3.44772 16 4 16H9C9.55228 16 10 15.5523 10 15Z"
              fill="var(--attachment-type-documents-color)"
            ></path>
          </svg>{" "}
          document
        </Dropdown.Item>
      </Dropdown>
    );
  }

  return (
    <Dropdown
      onClickCapture={() => setActive((prevActive) => !prevActive)}
      menuStyle={{ width: 200, padding: "1rem 0" }}
      onClose={() => setActive(false)}
      placement="bottomEnd"
      renderToggle={button}
    >
      <Dropdown.Item>New group</Dropdown.Item>
      <Dropdown.Item>New community</Dropdown.Item>
      <Dropdown.Item>Starred messages</Dropdown.Item>
      <Dropdown.Item>Settings</Dropdown.Item>
      <Dropdown.Item onClick={() => authCtx.logout()}>Log Out</Dropdown.Item>
    </Dropdown>
  );
}
