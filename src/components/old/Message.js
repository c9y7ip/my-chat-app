import React from "react";
import { formatRelative } from "date-fns";
import { ChatBox } from "react-chatbox-component";

const Message = ({ createdAt = null, text = "", displayName = "", guestName = "" }) => {
  return (
    <div>
      【{displayName}/{guestName}】{text}
    </div>
  );
};

export default Message;
