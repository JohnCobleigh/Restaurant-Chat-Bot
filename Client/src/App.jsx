import axios from 'axios';
import { useEffect, useRef, useState } from 'react'; // Importing React, useState, useEffect, and useRef hooks
import { AiOutlineAudio } from 'react-icons/ai'; // Importing the microphone icon for audio input
import { GoArrowUp } from 'react-icons/go'; // Importing the arrow icon for the send button
import './App.css'; // Importing the CSS file for styling

// Check if the browser supports the SpeechRecognition API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null; // Initialize SpeechRecognition

// The main Chatbot component
function Chatbot() {
  // useState hook to manage the list of messages and the user's input
  const [messages, setMessages] = useState([]); // Stores the history of chat messages
  const [userInput, setUserInput] = useState(''); // Stores the current input from the user
  const [imageURL, setImageURL] = useState(null) // Stores any image URL passed from backend
  const messagesEndRef = useRef(null); // Reference to the bottom of the messages list

  useEffect(() => {
    setTimeout(() => {
      const initialBotMessage = "Hi, I'm CPK-Bot. What can I get for you?"; // Bot's response
      setMessages([{ sender: 'bot', text: initialBotMessage }]); // Update state with the bot's reply
    }, 1000); // 1-second delay
  }, []); // Empty dependency array ensures this runs only once on mount

  // Scroll to bottom of the message list
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Call scrollToBottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to handle sending a message
  const handleSend = () => {
    // Prevent sending empty messages
    if (userInput.trim() === '') return;

    // Add the user's message to the chat history
    const newMessages = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages); // Update state with the new message

    // axios.post('/api/', { message: userInput })                                         // uncomment for local run
    axios.post(`${import.meta.env.VITE_SERVER_URL}/`, { message: userInput })         // uncomment for deploying
      .then(response => {
        const botResponse = response.data.replies || [response.data.reply];   // Backend response
        const botMessages = botResponse.map(reply => ({ sender: 'bot', text: reply}));
        
        setMessages([...newMessages, ...botMessages]);  // Update chat with bot's reply

        if (response.data.imageURL){
          setImageURL(response.data.imageURL);
        }
        else {
          setImageURL(null);
        }
      })
      .catch(error => {
        console.error("Error communicating with backend:", error);
        setMessages([...newMessages, { sender: 'bot', text: "Sorry, I couldn't process your request." }]);
        setImageURL(null)
      });

    // Clear the input field after sending the message
    setUserInput('');
  };
  
  // Function to handle key down events
  const handleKeyDown = (e) => {
    if(e.key === 'Enter') {
      e.preventDefault();
      handleSend(); // Call handleSend function
    }
  };

  // Function to start listening for audio input
  const startListening = () => {
    if (!recognition) {
      console.warn("SpeechRecognition not supported in this browser."); // Warn if SpeechRecognition is not supported
      return;
    }
    recognition.start(); // Start the SpeechRecognition
  };

  // Configure the SpeechRecognition
  if (recognition) {
    recognition.continuous = false; // Stop automatically
    recognition.interimResults = false; 

    // Event listener for when a result is captured
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript; // Get the recognized text
      setUserInput(transcript); // Set the userInput state with the transcribed text
    };

    // Error handling for speech recognition
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error); // Log recognition errors
    };
  }

  return (
    <div className="chatbot-container">
      {/* Logo */}
      <img src="https://upload.wikimedia.org/wikipedia/en/thumb/8/83/California_Pizza_Kitchen_Logo.svg/2880px-California_Pizza_Kitchen_Logo.svg.png" alt="CPK Logo" className="chatbot-logo" />
      {/* Chatbot header */}
      <div className="chatbot-header">CPK-Bot</div>

      {/* Display the messages */}
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.sender === 'bot' ? (
              <span dangerouslySetInnerHTML={{ __html: msg.text }} /> // Renders the bot message with HTML
            ) : (
              msg.text // User message is rendered as plain text
            )}
          </div>
        ))}

        {/* Render image if imageURL is present */}
        {imageURL && (
          <div className="chatbot-image">
            <img src={imageURL} alt="Description" />
          </div>
        )}

        {/* Ref element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input field for typing and sending messages */}
      <div className="chatbot-input">
        {/* Audio button for speech input */}
        <div className="audio-button" onClick={startListening}>
          <AiOutlineAudio size={20} /> {/* Microphone icon */}
        </div>
        <input
          type="text"
          value={userInput} // Bind the input field to the userInput state
          onChange={(e) => setUserInput(e.target.value)} // Update state with new input value
          onKeyDown={handleKeyDown}
          placeholder="Place an order or ask me about the menu!" // Prompt text for the input
        />
        <button onClick={handleSend}>
          <GoArrowUp size={25} /> {/* Arrow icon */}
        </button>
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