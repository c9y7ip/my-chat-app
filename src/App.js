 import firebase from 'firebase/app'
 import 'firebase/auth'
 import 'firebase/firestore'
 import React, { useState, useEffect } from 'react'
 
 import Button from './components/Button' 
 import Channel from './components/Channel'


 firebase.initializeApp({
  apiKey: "AIzaSyDIkqKdbwXYNATrLGYub6YFxSCuNlcQ0QQ",
  authDomain: "my-chat-app-e3398.firebaseapp.com",
  projectId: "my-chat-app-e3398",
  storageBucket: "my-chat-app-e3398.appspot.com",
  messagingSenderId: "964162708269",
  appId: "1:964162708269:web:0476566c8ee7d8fd8d29a4",
  measurementId: "G-ZBLXYNZJB0"
 })

 const auth = firebase.auth();
 const db = firebase.firestore();   

function App() {

  const [user, setUser] = useState(()=>auth.currentUser);
  const [initializing, setInitializing] = useState(true);
  const [nickName, setNickName] = useState("");

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged(user=>{
      if(user){
        setUser(user)
      }else{
        setUser(null)
      }

      if (initializing){
        setInitializing(false)
      }
    })

    return unsubscribe
  })

  const signInWithGoogle = async()=>{
    // const provider = new firebase.auth.GoogleAuthProvider();
    // auth.useDeviceLanguage();
    // try{
    //   await auth.signInWithPopup(provider);
    // }catch(e){
    //   console.error(e)
    // }

    firebase.auth().signInAnonymously()
      .then(() => {
        console.log(nickName)
      })
      .catch((error) => {
        console.log(error)
      });    
  }
  
  if (initializing) return "Loading ..."

  const signOut = async() =>{
    try{
      await firebase.auth().signOut();
    }catch(e){
      console.log(e.message);
    }
  }

  const handleNameChange = e =>{
    console.log(e.target.value)
    setNickName(e.target.value);
}

 return (
   <div>
     {user ? (
       <>
       <Button onClick={signOut}> Sign Out</Button>
       <Channel user={user} db={db} nickname={nickName}/>
       </>
     ):(
       <>
       <input onChange={handleNameChange} placeholder="Nickname"/> 
       <p/>
       <Button onClick={signInWithGoogle}> Sign in with Anonymously </Button>
  

       </>
     )}

   </div>
 )
}

export default App;
