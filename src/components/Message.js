import React from "react";

const Message = ({ text = {}, name = "" }) => {
  return (
    <div>
      【{name}】{text}
    </div>
  );
};

export default Message;
