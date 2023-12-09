import React from "react";
import CustomForm from "../components/Form";

const SignUp = (props) => {
  return (
    <div className="auth--page center">
      <CustomForm signup={props.signup} login={props.login} />
    </div>
  );
};

export default SignUp;
