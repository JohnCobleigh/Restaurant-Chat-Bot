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
    const response = await axios.post('http://localhost:5001', { message });
    setReply(response.data.reply);
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

