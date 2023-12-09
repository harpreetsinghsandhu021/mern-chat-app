import React, { useRef, useState, useReducer, useContext } from "react";
import {
  Form,
  Button,
  ButtonToolbar,
  Panel,
  Uploader,
  Message,
  Loader,
  useToaster,
} from "rsuite";
import axios from "axios";
import AvatarIcon from "@rsuite/icons/legacy/Avatar";
import classes from "../styles/Form.module.css";
import { useHttpClient } from "../shared/hooks/httpHook";
import { signUpModel, loginModel } from "../shared/Schema/FormSchema";
import { AuthContext } from "../shared/context/authContext";
import { NavLink } from "react-router-dom";

function previewFile(file, callback) {
  const reader = new FileReader();
  reader.onloadend = () => {
    callback(reader.result);
  };

  reader.readAsDataURL(file);
}

const TextField = React.forwardRef((props, ref) => {
  const { name, label, accepter, ...rest } = props;
  return (
    <Form.Group controlId={`${name}-4`} ref={ref}>
      <Form.ControlLabel>{label} </Form.ControlLabel>
      <Form.Control name={name} accepter={accepter} {...rest} />
    </Form.Group>
  );
});

const initialMessageState = {
  show: false,
  message: "",
};

function messageReducer(state, action) {
  if (action.type === "SUCCESS") {
    return { type: action.type, show: true, message: action.message };
  }
  if (action.type === "ERROR") {
    return { type: action.type, show: true, message: action.message };
  }

  if (action.type === "CLEAR") {
    return { show: false, message: "" };
  }

  return messageReducer;
}

const CustomForm = (props) => {
  const formRef = useRef();
  const authCtx = useContext(AuthContext);

  const [formError, setFormError] = useState({});
  const [formValue, setFormValue] = useState({
    name: "",
    email: "",
    password: "",
    verifyPassword: "",
  });

  const [loginFormValue, setLoginFormValue] = useState({
    email: "",
    password: "",
  });

  const [messageState, dispatch] = useReducer(
    messageReducer,
    initialMessageState
  );

  const cloudName = process.env.REACT_APP_CLOUD_NAME;
  const cloudSecret = process.env.REACT_APP_CLOUD_SECRET;
  const toaster = useToaster();
  const [uploading, setUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);

  const [originalFile, setOriginalFile] = useState(null);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const handleSubmit = async () => {
    if (!formRef.current.check()) {
      console.error("Form Error");
      return;
    }
    // console.log(formValue, fileInfo, "Form Value");

    const formData = new FormData();

    formData.append("email", formValue.email);
    formData.append("name", formValue.name);
    formData.append("password", formValue.password);
    formData.append("passwordConfirm", formValue.verifyPassword);
    formData.append("photo", originalFile);

    try {
      if (props.signup) {
        const res = await sendRequest(
          `${process.env.REACT_APP_API_URL}/users/signup`,
          "POST",
          formData
        );
        if (res.status === 201) {
          dispatch({ type: "SUCCESS", message: "User created succcessfully" });

          authCtx.login(res.data.data.user._id, res.data.token);
          window.location.href = "/";
        }
      } else {
        const res = await sendRequest(
          `${process.env.REACT_APP_API_URL}/users/login`,
          "POST",
          JSON.stringify(loginFormValue),
          {
            "Content-Type": "application/json",
          }
        );

        if (res.status === 200) {
          dispatch({ type: "SUCCESS", message: "Logged In  succcessfully" });

          authCtx.login(res.data.data.user._id, res.data.token);
          window.location.href = "/";
        }
      }
    } catch (err) {
      console.log(err);
      dispatch({ type: "ERROR", message: `${err}` });
    }
    setTimeout(() => {
      dispatch({ type: "CLEAR" });
    }, 3000);
  };

  const handleCheckEmail = () => {
    formRef.current.checkForField("email", (checkResult) => {
      console.log(checkResult);
    });
  };

  return (
    <>
      <div>
        {messageState.type === "SUCCESS" && messageState.show && (
          <Message className="message" showIcon type="success" header="Success">
            {messageState.message}
          </Message>
        )}
        {messageState.type === "ERROR" && messageState.show && (
          <Message className="message" showIcon type="error" header="ERROR">
            {messageState.message}
          </Message>
        )}
        <div className={classes.form}>
          {props.signup && (
            <div className={classes.headline}>
              <h3>Create an account</h3>
              <p>Let`s get started with your mindblowing journey.</p>
            </div>
          )}
          {props.login && (
            <div className={classes.headline}>
              <h3>Log In </h3>
              <p>Let`s get started with your mindblowing journey.</p>
            </div>
          )}

          {props.signup && (
            <>
              <Uploader
                fileListVisible={false}
                className={classes.uploader}
                listType="picture"
                accept=".png,.jpg,.jpeg"
                onUpload={(file) => {
                  setOriginalFile(file.blobFile);
                  setUploading(true);
                  previewFile(file.blobFile, (value) => {
                    setFileInfo(value);
                  });
                  setUploading(false);
                }}
              >
                <button
                  style={{
                    width: 130,
                    height: 130,
                    borderRadius: "50%",
                    marginBottom: "1rem",
                  }}
                >
                  {uploading && <Loader backdrop center />}
                  {fileInfo ? (
                    <img src={fileInfo} width="100%" height="100%" />
                  ) : (
                    <AvatarIcon style={{ fontSize: 80 }} />
                  )}
                </button>
              </Uploader>
            </>
          )}
          <Form
            ref={formRef}
            className={classes.inner__form}
            onChange={props.signup ? setFormValue : setLoginFormValue}
            onCheck={setFormError}
            formValue={props.signup ? formValue : loginFormValue}
            model={props.signup ? signUpModel : loginModel}
          >
            {props.signup && <TextField name="name" label="Username" />}
            <TextField name="email" label="Email" />
            <TextField
              name="password"
              label="Password"
              type="password"
              autoComplete="off"
            />
            {props.signup && (
              <TextField
                name="verifyPassword"
                label="Verify password"
                type="password"
                autoComplete="off"
              />
            )}

            <ButtonToolbar>
              <Button
                loading={isLoading}
                type="submit"
                color="violet"
                appearance="ghost"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </ButtonToolbar>
            {props.signup ? (
              <p className="txt-cntr">
                Already have an account.{" "}
                <strong>
                  {" "}
                  <NavLink to="/login"> Sign In </NavLink>{" "}
                </strong>{" "}
                here{" "}
              </p>
            ) : (
              <p className="txt-cntr">
                Don`t have an account.{" "}
                <strong>
                  {" "}
                  <NavLink to="/signup"> Sign Up </NavLink>{" "}
                </strong>{" "}
                here{" "}
              </p>
            )}
          </Form>
        </div>
      </div>
    </>
  );
};
export default CustomForm;
