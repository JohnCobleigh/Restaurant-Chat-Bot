import React, { useState } from 'react';
import axios from 'axios';

function Chatbot() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');

  const sendMessage = async () => {
    try {
      //console.log("Sending message: ", message);
      const response = await axios.post('http://localhost:5001', { message }, {timeout: 5000});
      //console.log("Received response: ", response.data);

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

