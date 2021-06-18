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
  const [capacity, setCapacity] = useState(2);

  const [hostName, setHostName] = useState("");
  const [guestName, setGuestName] = useState("");

  const [chatRoomList, setChatRoomList] = useState([]);
  const [selectTab, setSelectTab] = useState("home");

  useEffect(() => {
    signIn();

    //Update User Information
    const userUnsub = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser.uid);
        console.log("Login in as: " + user);

        db.collection("chat-room-list")
          .where("owner", "==", user)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // console.log(doc.ref.id);
              // console.log(doc.data());

              setUser(user);
              setHostName(doc.data().hostName);
              setTitle(doc.data().title);
              setCapacity(doc.data().capacity);
              setRoomOnwer(doc.data().owner);
              // setGuestName()
              setRoomID(doc.ref.id);
              setCreateCheck(true);
            });
          });
      } else {
        setUser(null);
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
    if (db) {
      await db
        .collection("chat-room-list")
        .add({
          title: title,
          capacity: capacity,
          owner: user,
          member: member + 1,
          hostName: hostName,
        })
        .then(function (doc) {
          setRoomID(doc.id);
          console.log("Room ID = " + doc.id);

          setRoomOnwer(user);
        });

      await db
        .collection(user + "-chat-room")
        .doc("private-message-meta")
        .set({
          owner: user,
          hostName: hostName,
        });

      console.log("Room created, Owner = " + user);
      setCreateCheck(true);
    }
  };
  return (
    <>
      <Tabs
        activeKey={selectTab}
        onSelect={(k) => setSelectTab(k)}
        id="uncontrolled-tab-example"
        className="tabs"
      >
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
                      placeholder="Title"
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                    ></input>
                  </p>
                  <p>
                    Capacity{" "}
                    <input
                      type="number"
                      placeholder="2"
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
                        setHostName(e.target.value);
                      }}
                    ></input>
                  </p>
                </Box>
                {capacity <= 0 || capacity > 10 ? (
                  <>
                    <p style={{ color: "red" }}>Capacity must between 0 and 10</p>

                    <Button disabled onClick={roomInfoConfirm}>
                      Craete
                    </Button>
                  </>
                ) : (
                  <Button onClick={roomInfoConfirm}>Craete</Button>
                )}
              </div>
            )}
          </div>
        </Tab>
        <Tab eventKey="room-list" title="Room List">
          <div className="grid">
            <ScrollableFeed forceScroll="true">
              {chatRoomList.map((room) => (
                <Chatroom
                  user={user}
                  roomID={room.id}
                  title={room.title}
                  capacity={room.capacity}
                  owner={room.owner}
                  setCreateCheck={setCreateCheck}
                  setTitle={setTitle}
                  setCapacity={setCapacity}
                  setRoomOnwer={setRoomOnwer}
                  setGuestName={setGuestName}
                  setRoomID={setRoomID}
                  setSelectTab={setSelectTab}
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
