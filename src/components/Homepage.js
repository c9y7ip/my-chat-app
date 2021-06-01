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
import RoomMessage from "./RoomMessage";
import { CompassCalibrationOutlined } from "@material-ui/icons";

function Homepage() {
  const auth = firebase.auth();
  const db = firebase.firestore();

  const [switches, setSwitches] = useState(true);
  const [createCheck, setCreateCheck] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [member, setMember] = useState(0);
  const [capacity, setCapacity] = useState(0);
  const [nickname, setNickname] = useState("");
  const [user, setUser] = useState("");
  const [chatRoomList, setChatRoomList] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [roomOnwer, setRoomOnwer] = useState("");

  useEffect(() => {
    const userUnsub = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser.uid);
        console.log("Login in as " + user);
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

    console.log("Getting from..." + roomOnwer + " this is roomOwner");
    console.log("Getting from..." + user + " this is user");

    const messageUnsub = db
      .collection(roomOnwer + "-chat-room-list")
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
  }, [db, roomOnwer, user]);

  const roomCreate = async () => {
    signIn();

    console.log("creating...");
    console.log();
    if (db) {
      db.collection("chat-room-list").add({
        Title: title,
        Capacity: capacity,
        Owner: user,
        Member: member + 1,
      });
    }

    db.collection(user + "-chat-room-list")
      .doc("private-message-meta")
      .set({
        Owner: user,
        Nickname: nickname,
      });

    console.log("Finished, Owner = " + user);

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

  const signIn = async () => {
    firebase.auth().signInAnonymously();
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <div className="grid">
            {createCheck ? (
              <RoomMessage
                user={user}
                nickname={nickname}
                title={title}
                capacity={capacity}
                member={member}
                messageList={messageList}
                roomOnwer={roomOnwer}
              />
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
              <Chatroom
                RoomId={room.id}
                Title={room.Title}
                Capacity={room.Capacity}
                Member={room.Member}
                Owner={room.Owner}
                setCreateCheck={setCreateCheck}
                setTitle={setTitle}
                setCapacity={setCapacity}
                setMember={setMember}
                setRoomOnwer={setRoomOnwer}
              />
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Homepage;
