// Import
import React, { useState, useEffect } from "react";
import { Button, Card, Col, Container, Row, label } from "react-bootstrap";
import AddIcon from "@material-ui/icons/Add";
import { Box, Fab, Grid } from "@material-ui/core";
import { confirmAlert } from "react-confirm-alert";

// components Import
import Chatroom from "./Chatroom";

// CSS Import
import "react-confirm-alert/src/react-confirm-alert.css";
import "../style/homepage.css";

// firebase Import
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import RoomMessage from "./RoomMessage";
import { set } from "date-fns";

function Homepage() {
  const auth = firebase.auth();
  const db = firebase.firestore();

  const [showChatRoom, setShowChatRoom] = useState(false);
  const [createCheck, setCreateCheck] = useState(false);

  const [title, setTitle] = useState("");
  const [member, setMember] = useState(0);
  const [capacity, setCapacity] = useState(0);
  const [nickname, setNickname] = useState("");
  const [guestName, setGuestName] = useState("");
  const [user, setUser] = useState("");
  const [chatRoomList, setChatRoomList] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [roomOnwer, setRoomOnwer] = useState("");
  const [roomID, setRoomID] = useState("");

  useEffect(() => {
    signIn();

    //Update User Information
    const userUnsub = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser.uid);
        console.log("Login in as " + user);
      } else {
        setUser(null);
        console.log(user);
      }
    });

    //Update Chat Room List
    const chatRooUnsub = db.collection("chat-room-list").onSnapshot((querySnapshot) => {
      const chatRoom = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setChatRoomList(chatRoom);
    });

    //Reading Message
    if (roomOnwer === "") {
      console.log("Getting from user ..." + user);
      const messageUnsub = db
        .collection(user + "-chat-room")
        .orderBy("CreatedAt", "asc")
        .onSnapshot((querySnapshot) => {
          const message = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setMessageList(message);
          console.log(message);
        });
      return messageUnsub, chatRooUnsub, userUnsub;
    } else {
      console.log("Getting from roomOwner..." + roomOnwer);
      const messageUnsub = db
        .collection(roomOnwer + "-chat-room")
        .orderBy("CreatedAt", "asc")
        .onSnapshot((querySnapshot) => {
          const message = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setMessageList(message);
          console.log(message);
        });
      return messageUnsub, chatRooUnsub, userUnsub;
    }
  }, [db, auth, roomOnwer, user]);

  const signIn = async () => {
    firebase.auth().signInAnonymously();
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

  const roomCreate = async () => {
    console.log("Creating Room ...");
    setMember(member + 1);
    if (db) {
      await db
        .collection("chat-room-list")
        .add({
          Title: title,
          Capacity: capacity,
          Owner: user,
          Member: member + 1,
        })
        .then(function (doc) {
          console.log("Room ID = ", doc.id);
          setRoomID(doc.id);
          setRoomOnwer(user);
          setMember(member + 1);
        });

      await db
        .collection(user + "-chat-room")
        .doc("private-message-meta")
        .set({
          Owner: user,
          DisplayName: nickname,
        });

      console.log("Room created, Owner = " + user);
      setCreateCheck(true);
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <div className="grid">
            {createCheck ? (
              //Show private chat room
              <RoomMessage
                user={user}
                nickname={nickname}
                title={title}
                capacity={capacity}
                messageList={messageList}
                roomOnwer={roomOnwer}
                guestName={guestName}
                roomID={roomID}
                setCreateCheck={setCreateCheck}
              />
            ) : !showChatRoom ? (
              //Create room button
              <Box className="addButton" display="flex" justifyContent="center" alignItems="center">
                <Fab aria-label="add" color="primary" onClick={() => setShowChatRoom(true)}>
                  <AddIcon />
                </Fab>
              </Box>
            ) : (
              //Show create room inforamtion (active by => setSwitches(true))
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
          {/*Chat room list */}
          <div className="grid">
            {chatRoomList.map((room) => (
              <Chatroom
                key={room.id}
                roomID={room.id}
                title={room.Title}
                capacity={room.Capacity}
                member={room.Member}
                owner={room.Owner}
                setCreateCheck={setCreateCheck}
                setTitle={setTitle}
                setCapacity={setCapacity}
                setMember={setMember}
                setRoomOnwer={setRoomOnwer}
                setGuestName={setGuestName}
                setRoomID={setRoomID}
              />
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Homepage;
