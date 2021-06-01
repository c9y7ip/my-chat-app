import React from "react";
import { formatRelative } from "date-fns";
import { ChatBox } from "react-chatbox-component";

const Message = ({ text = {}, name = "" }) => {
  return (
    <div>
      【{name}】{text}
    </div>
  );
};

export default Message;
