import React, { useState, useEffect } from "react";
import "../style/homepage.css";

const Message = ({ text = {}, name = "", messageOwner = "", user = "" }) => {
  const [equality, setEquality] = useState(false);

  useEffect(() => {
    if (messageOwner === user) {
      setEquality(true);
    }
  }, [messageOwner, user]);

  return (
    <>
      {equality ? (
        <div style={{ marginTop: "10px" }}>
          <p className="right-nickname">{name}</p>
          <p className="right-message">{text}</p>
        </div>
      ) : (
        <div>
          <p className="left-nickname">{name}</p>
          <p className="left-message">{text}</p>
        </div>
      )}
    </>
  );
};

export default Message;
