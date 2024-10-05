import axios from 'axios';
import { useState } from 'react'; // Importing React and useState hook for managing state
import './App.css'; // Importing the CSS file for styling

// The main Chatbot component
function Chatbot() {
  // useState hook to manage the list of messages and the user's input
  const [messages, setMessages] = useState([]); // Stores the history of chat messages
  const [userInput, setUserInput] = useState(''); // Stores the current input from the user

  // Function to handle sending a message
  const handleSend = () => {
    // Prevent sending empty messages
    if (userInput.trim() === '') return;

    // Add the user's message to the chat history
    const newMessages = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages); // Update state with the new message

    // Simulate a bot response after a short delay
    /*setTimeout(() => {
      const botResponse = `Hi, I'm CPK-Bot. What can I get for you?`; // Bot's response
      setMessages([...newMessages, { sender: 'bot', text: botResponse }]); // Update state with the bot's reply
    }, 1000); // 1-second delay*/
    
    // http://localhost:5001/
    axios.post('/api/', { message: userInput })
      .then(response => {
        const botResponse = response.data.reply;  // Backend response
        setMessages([...newMessages, { sender: 'bot', text: botResponse }]);  // Update chat with bot's reply
      })
      .catch(error => {
        console.error("Error communicating with backend:", error);
        setMessages([...newMessages, { sender: 'bot', text: "Sorry, I couldn't process your request." }]);
      });

    // Clear the input field after sending the message
    setUserInput('');
  };
  // Function to handle key down events
  const handleKeyDown = (e) => {
    if(e.key === 'Enter') {
      e.preventDefault();
      handleSend();//call handleSend function
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chatbot header */}
      <div className="chatbot-header">CPK-Bot</div>

      {/* Display the messages */}
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input field for typing and sending messages */}
      <div className="chatbot-input">
        <input
          type="text"
          value={userInput} // Bind the input field to the userInput state
          onChange={(e) => setUserInput(e.target.value)} // Update state with new input value
          onKeyDown={handleKeyDown}
          placeholder="Place an order or ask me about the menu!" // Prompt text for the input
        />
        <button onClick={handleSend}>Enter</button> {/* Send button triggers the handleSend function */}
      </div>
    </div>
  );
}

// Main App component that renders the Chatbot
function App() {
  return (
    <div className="App">
      <Chatbot /> {/* Renders the Chatbot component */}
    </div>
  );
}

export default App; // Export the App component as the default export
