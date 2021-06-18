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
  user = "",
  roomID = "",
  title = "",
  capacity = 0,
  owner = "",
  setCreateCheck = {},
  setTitle = {},
  setCapacity = {},
  setRoomOnwer = {},
  setGuestName = {},
  setRoomID = {},
  setSelectTab = {},
}) => {
  const db = firebase.firestore();
  const [nickName, setNickName] = useState("");
  const [member, setMember] = useState(0);

  useEffect(() => {
    const updateNumber = db
      .collection("chat-room-list")
      .doc(roomID)
      .get("member")
      .then(function (doc) {
        if (doc.exists) {
          console.log(doc.data().member, "<<<<<<<<<<<<<<<<<<<");
          setMember(doc.data().member);
        } else {
          setCreateCheck(false);
        }
      });
  });

  const incraseMember = async () => {
    console.log("Updating memeber with room ID...", roomID);
    try {
      console.log(member, " this + 1");
      await db
        .collection("chat-room-list")
        .doc(roomID)
        .update({
          member: member + 1,
        });
    } catch (e) {
      console.log(e);
    }
  };

  const joinChatRoom = async () => {
    console.log("Room Onwer = " + owner);
    var inputName = window.prompt("Enter your nickname");
    setNickName(inputName);

    incraseMember();
    confirmAlert({
      title: "You want to join this room? Using name " + inputName,

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
            setGuestName(inputName);
            setNickName(inputName);
            setSelectTab("home");
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
            Capacity # {member}/{capacity}
            {owner !== user ? (
              member == capacity ? (
                <p>Full</p>
              ) : (
                <Button onClick={joinChatRoom} className="cardButton" variant="priamry">
                  Join
                </Button>
              )
            ) : (
              <p>Joined!</p>
            )}
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Chatroom;
