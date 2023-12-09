import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import CustomDropdown from "./Dropdown";

const Attachments = () => {
  return (
    <div>
      <CustomDropdown type="filepicker" icon={<AiOutlinePlus />} />
    </div>
  );
};

export default Attachments;
