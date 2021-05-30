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

function Homepage() {
  const auth = firebase.auth();
  const db = firebase.firestore();

  const [switches, setSwitches] = useState(true);
  const [createCheck, setCreateCheck] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [nickname, setNickname] = useState("");
  const [user, setUser] = useState("");
  const [chatRoomList, setChatRoomList] = useState([]);
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    const userUnsub = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser.uid);
        console.log(user);
      } else {
        setUser(null);
        console.log(user);
      }
    });

    const chatRooUnsub = db.collection("chat-room-list").onSnapshot((querySnapshot) => {
      const chatRoom = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setChatRoomList(chatRoom);
      // console.log(chatRoom);
    });

    const messageUnsub = db
      .collection("messages")
      .orderBy("createdAt", "asc")
      .onSnapshot((querySnapshot) => {
        const message = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMessageList(message);
        // console.log(message);
      });

    return chatRooUnsub, messageUnsub, userUnsub;
  }, [db, user]);

  const roomCreate = async () => {
    signIn();

    console.log("creating...");
    if (db) {
      db.collection("chat-room-list").add({
        Title: title,
        Capacity: capacity,
        Owner: user,
      });
    }
    setCreateCheck(true);
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

  const handleOnSubmitMessage = (e) => {
    e.preventDefault();
    if (db) {
      db.collection("messages").add({
        text: message,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        displayName: nickname,
        user: user,
      });
    }
  };

  const signIn = async () => {
    firebase
      .auth()
      .signInAnonymously()
      .then(() => {
        console.log(user + "<<<<<<<<<");
      })
      .catch((error) => {
        console.log(error + "<-------");
      });
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <div className="grid">
            {createCheck ? (
              <>
                <div className="topNav">
                  <h5 className="topNav-header-1">
                    {title} <span className="topNav-header-2">{capacity}</span>
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
            ) : !switches ? (
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
            {chatRoomList.map((room) => (
              <Chatroom id={room.Owner} Title={room.Title} Capacity={room.Capacity} />
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Homepage;
