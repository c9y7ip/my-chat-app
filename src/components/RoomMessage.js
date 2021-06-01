import React, { useState, useEffect } from "react";
import { Button, Card, Col, Container, Row, label } from "react-bootstrap";
import AddIcon from "@material-ui/icons/Add";
import PersonIcon from "@material-ui/icons/Person";
import homepage from "../style/homepage.css";
import { Box, Fab, Grid } from "@material-ui/core";
import Chatroom from "./Chatroom";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import ReactScrollableList from "react-scrollable-list";
import Message from "./old/Message";

const RoomMessage = ({
  user = "",
  nickname = "",
  title = "",
  capacity = 0,
  member = 0,
  messageList = [],
  roomOnwer = "",
}) => {
  const db = firebase.firestore();

  const [message, setMessage] = useState("");

  const handleOnSubmitMessage = (e) => {
    e.preventDefault();
    if (db) {
      db.collection({ roomOnwer } + "-chat-room-list").add({
        text: message,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        displayName: nickname,
        user: user,
      });
    }
  };

  return (
    <>
      <div className="topNav">
        <h5 className="topNav-header-1">
          {title}{" "}
          <span className="topNav-header-2">
            {member}/{capacity}
          </span>
        </h5>
      </div>
      <div className="chatRoom">
        {messageList.map((message) => (
          <Message {...message} />
        ))}
      </div>
      <div className="InputBar">
        <button type="button" className="btn btn-danger btn-sm">
          Leave
        </button>
        <input
          className="input"
          onChange={(e) => {
            setMessage(e.target.value);
            console.log(message);
          }}
        ></input>
        <button
          type="button"
          className="btn btn-success btn-sm sendButton"
          onClick={handleOnSubmitMessage}
        >
          Send
        </button>
      </div>
    </>
  );
};

export default RoomMessage;
