import React, { useState, useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

const Chatroom = ({ Title = "aloha", Capacity = "0" }) => {
  const [nickName, setNickName] = useState("");

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
            Capacity # {Capacity}/3
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
