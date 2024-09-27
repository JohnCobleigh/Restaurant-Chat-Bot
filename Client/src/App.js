/*import React, {useEffect, useState} from 'react'

function App(){

  const [backendData, setBackendData] = useState([{}])

  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data =>{
        setBackendData(data.users)
      }
    )
  }, [])

  return(
    <div>

    </div>
  )
}

//HALLO
// hey

export default App
*/

import React, { useState } from 'react';
import axios from 'axios';

function Chatbot() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');

  const sendMessage = async () => {
    try {
      // console.log("TEST1");
      const response = await axios.post('http://localhost:5000', { message }, {timeout: 5000});
      // console.log("TEST2");
      setReply(response.data.reply);
    } catch (error) {
      console.error("Error while sending message:", error);
    }
  };
  

  return (
    <div>
      <h1>Restaurant Chatbot</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your order here"
      />
      <button onClick={sendMessage}>Send</button>
      <p>{reply}</p>
    </div>
  );
}

export default Chatbot;

