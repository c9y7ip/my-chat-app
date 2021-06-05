import React, { useState, useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

const Chatroom = ({
  RoomId = "null",
  Owner = "",
  Title = "aloha",
  Capacity = "0",
  Member = 0,
  setCreateCheck = {},
  setTitle = {},
  setCapacity = 0,
  setMember = {},
  setRoomOnwer = {},
  setGuestName = {},
  setRoomID = {},
}) => {
  const [nickName, setNickName] = useState("123");
  const db = firebase.firestore();
  // const [roomMember, setRoomMember] = useState(Member);

  const setUpName = () => {
    const enterName = prompt("Enter your nickname");
    setGuestName(enterName);
    joinChatRoom();
  };

  const incraseMember = async () => {
    console.log("Updating memeber ...", RoomId);
    try {
      await db
        .collection("chat-room-list")
        .doc(RoomId)
        .update({
          Member: Member + 1,
        });
    } catch (e) {
      console.log(e);
    }
  };

  const joinChatRoom = () => {
    console.log("Room Onwer = " + Owner);
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
            setTitle(Title);
            setCapacity(Capacity);
            setMember(Member + 1);
            setRoomOnwer(Owner);
            setRoomID(RoomId);
          },
        },
      ],
    });
  };

  return (
    <div className="card-wrapper">
      <Card className="card">
        <Card.Subtitle className="cardSubTitle">{Title}</Card.Subtitle>
        <Card.Body className="cardBody">
          <p className="cardCapacity">
            Capacity # {Member}/{Capacity}
            <Button onClick={setUpName} className="cardButton" variant="priamry">
              Join
            </Button>
            {/* <p>{RoomId}</p> */}
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Chatroom;
