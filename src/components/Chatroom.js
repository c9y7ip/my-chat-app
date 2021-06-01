import React, { useState, useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

const Chatroom = ({
  RoomId = "null",
  Owner = "",
  Title = "aloha",
  Capacity = "0",
  Member = "0",
  setCreateCheck = {},
  setTitle = {},
  setCapacity = 0,
  setMember = 0,
  setRoomOnwer = "",
}) => {
  const [nickName, setNickName] = useState("123");

  const setUpName = () => {
    const enterName = prompt("Enter your nickname");
    setNickName(enterName);
    joinChatRoom();
  };

  const joinChatRoom = () => {
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
            setMember(Member);
            setRoomOnwer(Owner);
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
