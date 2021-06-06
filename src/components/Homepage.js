// Import
import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, label, Tab, Tabs, Pagination } from "react-bootstrap";
import AddIcon from "@material-ui/icons/Add";
import { Box, Fab, Grid } from "@material-ui/core";
import { confirmAlert } from "react-confirm-alert";
import ScrollableFeed from "react-scrollable-feed";

// components Import
import Chatroom from "./Chatroom";
import RoomMessage from "./RoomMessage";

// CSS Import
import "react-confirm-alert/src/react-confirm-alert.css";
import "../style/homepage.css";

// firebase Import
import firebase from "firebase/app";
import "firebase/auth";

function Homepage() {
  const auth = firebase.auth();
  const db = firebase.firestore();

  const [user, setUser] = useState("");
  const [roomID, setRoomID] = useState("");
  const [roomOnwer, setRoomOnwer] = useState("");

  const [showChatRoom, setShowChatRoom] = useState(false);
  const [createCheck, setCreateCheck] = useState(false);

  const [title, setTitle] = useState("");
  const [member, setMember] = useState(0);
  const [capacity, setCapacity] = useState(0);

  const [hostName, setNickname] = useState("");
  const [guestName, setGuestName] = useState("");

  const [chatRoomList, setChatRoomList] = useState([]);

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

    return [userUnsub, chatRooUnsub];
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
        ",hostName=" +
        hostName,
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
          title: title,
          capacity: capacity,
          owner: user,
          member: member + 1,
        })
        .then(function (doc) {
          setRoomID(doc.id);
          console.log("Room ID = " + roomID);

          setRoomOnwer(user);
          setMember(member + 1);
        });

      await db
        .collection(user + "-chat-room")
        .doc("private-message-meta")
        .set({
          owner: user,
          displayName: hostName,
        });

      console.log("Room created, Owner = " + user);
      setCreateCheck(true);
    }
  };
  return (
    <>
      {/* <video autoPlay loop muted className="video-background">
        <source src={video_bg} type="video/mp4" />
      </video> */}

      <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="tabs">
        <Tab eventKey="home" title="Home">
          <div className="grid">
            {createCheck ? (
              //Show private chat room
              <RoomMessage
                user={user}
                hostName={hostName}
                title={title}
                capacity={capacity}
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
                    hostName{" "}
                    <input
                      placeholder="hostName"
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
        </Tab>
        <Tab eventKey="room-list" title="Room List">
          <div className="grid">
            <ScrollableFeed forceScroll="true">
              {chatRoomList.map((room) => (
                <Chatroom
                  roomID={room.id}
                  title={room.title}
                  capacity={room.capacity}
                  member={room.member}
                  owner={room.owner}
                  setCreateCheck={setCreateCheck}
                  setTitle={setTitle}
                  setCapacity={setCapacity}
                  setMember={setMember}
                  setRoomOnwer={setRoomOnwer}
                  setGuestName={setGuestName}
                  setRoomID={setRoomID}
                />
              ))}
            </ScrollableFeed>
          </div>
        </Tab>
      </Tabs>
    </>
  );
}

export default Homepage;
