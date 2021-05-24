import React, { useState,useEffect } from 'react'
import firebase from 'firebase/app'
import Message from './Message';

const Channel = ({user=null, db=null})=>{
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const {uid,displayName,photoURL} = user;

    useEffect(()=>{
        if(db){
        const unsubscribe = db
            .collection('messages')
            .orderBy('createdAt')
            .limit(100)
            .onSnapshot(querySnapshot=>{
                const data = querySnapshot.docs.map(doc=>({
                    ...doc.data(),
                    id:doc.id,
                }));

                setMessages(data)
            })
        return unsubscribe

        }

    },[db]);

    const handleOnChange = e =>{
        setNewMessage(e.target.value);
    }

    const hadnleOnSubmit = e => {
        e.preventDefault();

        if(db){
            db.collection('messages').add({
                text:newMessage,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid,
                displayName,
                photoURL
            })
        }
    }

return(
    <div>
    <ul>
        {messages.map(message=>(
            <li key={message.id}>
                <Message {...message}/>
            </li>
        ))}
    </ul>
    <form onSubmit={hadnleOnSubmit}>
    <input onChange={handleOnChange}/>
    <button type="submit">Send</button>
    </form>
    </div>
)
}

export default Channel;