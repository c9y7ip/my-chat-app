// Import
import React, { useState, useEffect } from "react";
import firebase from "firebase/app";

import ScrollableFeed from "react-scrollable-feed";
// Components Import
import Message from "./Message";

// CSS Import
import "../style/homepage.css";
import "react-confirm-alert/src/react-confirm-alert.css";

// firebase Import
import "firebase/auth";
import "firebase/firestore";
import { HourglassEmpty } from "@material-ui/icons";

const RoomMessage = ({
  user = "",
  nickname = "",
  title = "",
  capacity = 0,
  messageList = [],
  roomOnwer = "",
  guestName = "",
  roomID = "",
  setCreateCheck = {},
}) => {
  const db = firebase.firestore();
  const [message, setMessage] = useState("");
  const [member, setMember] = useState(0);

  useEffect(() => {
    const room = db
      .collection("chat-room-list")
      .doc(roomID)
      .get("Member")
      .then(function (doc) {
        if (doc.exists) {
          setMember(doc.data().Member);
        } else {
          setCreateCheck(false);
        }
      });
  });

  const signOut = async () => {
    try {
      await firebase.auth().signOut();
      console.log("Sign Out!");
    } catch (e) {
      console.log(e);
    }
  };

  const hostLeave = async () => {
    console.log("Creator Leaving ...");
    console.log("User = ", user);
    console.log("RoomOwner = ", roomOnwer);
    try {
      await db.collection("chat-room-list").doc(roomID).delete();
      setCreateCheck(false);
      console.log("Deleting ... " + user + "-chat-room");
      await db
        .collection(user + "-chat-room")
        .get()
        .then((res) => {
          res.forEach((e) => {
            e.ref.delete();
          });
        });
    } catch (e) {
      console.log(e);
    }
  };

  const guestLeave = async () => {
    console.log("Guest Leaving ...");
    console.log("User = ", user);
    console.log("RoomOwner = ", roomOnwer);
    try {
      decraseMember();
      setCreateCheck(false);
    } catch (e) {
      console.log(e);
    }
  };

  const decraseMember = async () => {
    console.log("Decrasing memeber ...", roomID);
    try {
      await db
        .collection("chat-room-list")
        .doc(roomID)
        .update({
          Member: member - 1,
        });
    } catch (e) {
      console.log(e);
    }
  };

  const handleOnSubmitMessage = (e) => {
    e.preventDefault();
    if (db) {
      // you are Host
      if (roomOnwer === "") {
        console.log("Sending to ...." + user);

        db.collection(user + "-chat-room").add({
          Text: message,
          CreatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          DisplayName: nickname,
          User: user,
        });
      } else {
        // you are Guest
        console.log("Sending to ...." + roomOnwer);

        db.collection(roomOnwer + "-chat-room").add({
          Text: message,
          CreatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          DisplayName: guestName,
          User: user,
        });
      }
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
        {/* <ScrollableFeed forceScroll="true" style={{ height: "100%" }}>
          {messageList.map((message) => (
            <>
              <Message {...message} key={{ ...message }.DisplayName} />
            </>
          ))}
        </ScrollableFeed> */}
      </div>
      <div className="InputBar">
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={user === roomOnwer ? hostLeave : guestLeave}
        >
          Leave
        </button>
        <input
          className="input"
          onChange={(e) => {
            setMessage(e.target.value);
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
