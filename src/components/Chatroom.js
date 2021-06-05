//Import
import React, { useState, useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

//CSS Import
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

//firebase Import
import "firebase/auth";
import "firebase/firestore";
import firebase from "firebase/app";

const Chatroom = ({
  roomID = "",
  title = "",
  capacity = 0,
  member = 0,
  owner = "",
  setCreateCheck = {},
  setTitle = {},
  setCapacity = {},
  setMember = {},
  setRoomOnwer = {},
  setGuestName = {},
  setRoomID = {},
}) => {
  const db = firebase.firestore();
  const [nickName, setNickName] = useState();

  const incraseMember = async () => {
    setMember(member + 1);
    console.log("Updating memeber ...", roomID);
    try {
      await db
        .collection("chat-room-list")
        .doc(roomID)
        .update({
          Member: member + 1,
        });
    } catch (e) {
      console.log(e);
    }
  };

  const setUpName = () => {
    const enterName = prompt("Enter your nickname");
    setNickName(enterName);
    joinChatRoom();
  };

  const joinChatRoom = () => {
    console.log("Room Onwer = " + owner);
    incraseMember();
    confirmAlert({
      title: "You want to join this room? Using name " + nickName,

      buttons: [
        {
          label: "No",
        },
        {
          label: "Yes",
          onClick: () => {
            setCreateCheck(true);
            setTitle(title);
            setCapacity(capacity);
            setRoomOnwer(owner);
            setRoomID(roomID);
          },
        },
      ],
    });
  };

  return (
    <div className="card-wrapper">
      <Card className="card">
        <Card.Subtitle className="cardSubTitle">{title}</Card.Subtitle>
        <Card.Body className="cardBody">
          <p className="cardCapacity">
            capacity # {member}/{capacity}
            <Button onClick={setUpName} className="cardButton" variant="priamry">
              Join
            </Button>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Chatroom;
