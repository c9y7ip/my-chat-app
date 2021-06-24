import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import homepage from "./components/Homepage";
import firebase from "firebase/app";

firebase.initializeApp({
  apiKey: "AIzaSyDIkqKdbwXYNATrLGYub6YFxSCuNlcQ0QQ",
  authDomain: "my-chat-app-e3398.firebaseapp.com",
  projectId: "my-chat-app-e3398",
  storageBucket: "my-chat-app-e3398.appspot.com",
  messagingSenderId: "964162708269",
  appId: "1:964162708269:web:0476566c8ee7d8fd8d29a4",
  measurementId: "G-ZBLXYNZJB0",
});

function App() {
  return (
    <Router>
      <Route exact path="/" component={homepage} />
    </Router>
  );
}

export default App;
