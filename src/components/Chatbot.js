import React, { useState, useRef, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import APIService from '../Common/API';
import '../styles/Chatbot.css';
import { FaTimes, FaRobot, FaUser, FaPaperPlane, FaExpand, FaCompress } from 'react-icons/fa';

const Chatbot = ({ isOpen, toggleChatbot }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Check if device is small screen
  // const isMobileDevice = () => window.innerWidth <= 768;

  // Auto-scroll to bottom when messages update (disabled in fullscreen)
  useEffect(() => {
    if (!isFullScreen) {
      // scrollToBottom();
    }
  }, [messages, isFullScreen]);
  
  
  // Toggle full screen mode
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    // Call Gemini API
    try {
      await APIService({
        question: input,
        onResponse: (response) => {
          setIsLoading(false);
          
          // Extract text from Gemini response
          const botText = response.candidates?.[0]?.content?.parts?.[0]?.text || 
                         "Sorry, I couldn't process that request.";
          
          // Add bot message
          const botMessage = {
            text: botText,
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          
          setMessages(prevMessages => [...prevMessages, botMessage]);
        }
      });
    } catch (error) {
      console.error("Error in chatbot:", error);
      setIsLoading(false);
      
      // Add error message
      const errorMessage = {
        text: "Sorry, there was an error processing your request. Please try again.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };

  // If chatbot is closed, don't render anything
  if (!isOpen) return null;

  return (
    <div className={`chatbot-container ${isFullScreen ? 'fullscreen' : ''}`}>
      <Card className="chatbot-card">
        <Card.Header className="chatbot-header">
          <div className="chatbot-title">
            <FaRobot className="chatbot-icon" />
            <span>AI Assistant</span>
          </div>
          <div className="chatbot-controls">
            <Button 
              variant="link" 
              className="control-button" 
              onClick={toggleFullScreen}
              aria-label={isFullScreen ? "Exit full screen" : "Full screen"}
            >
              {isFullScreen ? <FaCompress /> : <FaExpand />}
            </Button>
            <Button 
              variant="link" 
              className="close-button" 
              onClick={toggleChatbot}
            >
              <FaTimes />
            </Button>
          </div>
        </Card.Header>
        
        <Card.Body className="chatbot-body">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <p>Hello! I'm your AI assistant. How can I help you today?</p>
            </div>
          ) : (
            <div className="messages-container">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
                >
                  <div className="message-icon">
                    {msg.sender === 'user' ? <FaUser /> : <FaRobot />}
                  </div>
                  <div className="message-content">
                    {msg.sender === 'user' ? (
                      <div className="message-text">{msg.text}</div>
                    ) : (
                      <div className="message-text markdown-content">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message bot-message">
                  <div className="message-icon">
                    <FaRobot />
                  </div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </Card.Body>
        
        <Card.Footer className="chatbot-footer">
          <Form onSubmit={handleSubmit} className="chatbot-form">
            <Form.Control
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="chatbot-input"
            />
            <Button 
              type="submit" 
              className="send-button"
              disabled={isLoading || !input.trim()}
            >
              <FaPaperPlane />
            </Button>
          </Form>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default Chatbot;
