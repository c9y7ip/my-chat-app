import React from "react";
import { formatRelative } from "date-fns";
import { ChatBox } from "react-chatbox-component";

const Message = ({ createdAt = null, text = "", displayName = "" }) => {
  return <div>{text}</div>;
};

export default Message;
