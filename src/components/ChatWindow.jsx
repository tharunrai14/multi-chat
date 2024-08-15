/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function ChatWindow({ selectedUser, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:3000');

    // Generate a unique room ID based on the current user and selected user
    const roomId = [currentUser.id, selectedUser.id].sort().join('-');
    socket.emit('join', roomId);

    // Fetch previous messages from the server using fetch API
    fetch(`http://localhost:3000/messages?senderId=${currentUser.id}&receiverId=${selectedUser.id}`)
      .then(response => response.json())
      .then(data => {
        setMessages(data);
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
      });

    // Listen for incoming messages in this specific room
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on component unmount
    return () => {
      socket.emit('leave', roomId);
      socket.disconnect();
    };
  }, [selectedUser, currentUser]);

  const handleSendMessage = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      const roomId = [currentUser.id, selectedUser.id].sort().join('-');
      const newMessage = {
        senderId: currentUser.id,
        receiverId: selectedUser.id,
        content: e.target.value,
        createdAt: new Date(),
      };

      // Send message to the server
      const socket = io('http://localhost:3000');
      socket.emit('message', newMessage);

      // Update local state with the new message
      //setMessages((prevMessages) => [...prevMessages, newMessage]);

      e.target.value = '';
      setIsTyping(false); // Reset typing indicator
    }
  };

  const handleTyping = (event) => {
    setIsTyping(true);
    if (event.target.value === '') {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="flex items-center p-4 border-b border-gray-300">
        <img src={selectedUser.profilePic} alt="Profile" className="w-10 h-10 rounded-full mr-3" />
        <div>
          <p className="font-bold">{selectedUser.username}</p>
          {isTyping && <p className="text-sm text-green-500">Typing...</p>}
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.senderId === currentUser.id ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded ${message.senderId === currentUser.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
              <p>{message.content}</p>
            </div>
            <p className="text-xs text-gray-400 mt-1">{new Date(message.createdAt).toLocaleTimeString()}</p>
          </div>
        ))}
      </div>
      <div className="flex p-4 border-t border-gray-300">
        <input
          type="text"
          className="flex-1 p-2 border border-gray-400 rounded"
          placeholder="Type your message here"
          onKeyDown={handleSendMessage}
          onChange={handleTyping}
        />
        <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={(e) => handleSendMessage(e)}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
