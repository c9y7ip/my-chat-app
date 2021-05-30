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

function Homepage() {
  const [switches, setSwitches] = useState(true);
  const [title, setTitle] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [nickname, setNickname] = useState("");

  const [chatRoomList, setChatRoomList] = useState([]);

  const auth = firebase.auth();
  const db = firebase.firestore();

  useEffect(() => {
    if (db) {
      const unsub = db.collection("chat-room-list").onSnapshot((querySnapshot) => {
        const chatRoom = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setChatRoomList(chatRoom);
        console.log(chatRoom);
      });
      return unsub;
    }
  }, [db]);

  const roomCreate = async () => {
    console.log("creating...");
    if (db) {
      db.collection("chat-room-list").add({
        Title: title,
        Capacity: capacity,
      });
    }
  };

  const roomInfoConfirm = () => {
    confirmAlert({
      title: "Confirm to submit",
      message:
        "Are your sure you use following information title = " +
        title +
        ", capacity=" +
        capacity +
        ",nickname=" +
        nickname,
      buttons: [
        {
          label: "No",
        },
        {
          label: "Yes",
          onClick: () => roomCreate(),
        },
      ],
    });
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <div className="grid">
            {!switches ? (
              <Box className="addButton" display="flex" justifyContent="center" alignItems="center">
                <Fab aria-label="add" color="primary" onClick={() => setSwitches(true)}>
                  <AddIcon />
                </Fab>
              </Box>
            ) : (
              <div className="room-profile">
                <Box className="room-input">
                  <p>
                    Title{" "}
                    <input
                      placeholder="title"
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                    ></input>
                  </p>
                  <p>
                    Capacity{" "}
                    <input
                      placeholder="0"
                      onChange={(e) => {
                        setCapacity(e.target.value);
                      }}
                    ></input>
                  </p>
                  <p>
                    Nickname{" "}
                    <input
                      placeholder="Nickname"
                      onChange={(e) => {
                        setNickname(e.target.value);
                      }}
                    ></input>
                  </p>
                </Box>
                <Button onClick={roomInfoConfirm}>Craete</Button>
              </div>
            )}
          </div>
        </Col>

        <Col>
          <div className="grid">
            {/* <Chatroom Title={title} Capacity={capacity} /> */}
            {chatRoomList.map((room) => (
              <Chatroom Title={room.Title} Capacity={room.Capacity} />
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Homepage;
