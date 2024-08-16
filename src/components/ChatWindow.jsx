/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import io from 'socket.io-client';

function ChatWindow({ selectedUser, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const socket = io('https://chat-backendd-aff9218c1774.herokuapp.com/');

    socket.emit('register', currentUser.id);

    const roomId = [currentUser.id, selectedUser.id].sort().join('-');
    socket.emit('join', roomId);

    fetch(`https://chat-backendd-aff9218c1774.herokuapp.com/messages?senderId=${currentUser.id}&receiverId=${selectedUser.id}`)
      .then(response => response.json())
      .then(data => {
        setMessages(data);
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
      });

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('typing', ({ senderId, isTyping }) => {
      if (senderId === selectedUser.id) {
        setIsTyping(isTyping);
      }
    });

    socket.on('messageRead', ({ messageId, receiverId }) => {
      if (receiverId === currentUser.id) {
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message.id === messageId ? { ...message, read: true } : message
          )
        );
      }
    });

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

      const socket = io('https://chat-backendd-aff9218c1774.herokuapp.com/');
      socket.emit('message', newMessage);
      socket.emit('messageRead', { messageId: newMessage.id, receiverId: selectedUser.id });

      e.target.value = '';
      setIsTyping(false);
    }
  };

  const handleTyping = (event) => {
    setIsTyping(true);
    const socket = io('https://chat-backendd-aff9218c1774.herokuapp.com/');
    socket.emit('typing', { senderId: currentUser.id, receiverId: selectedUser.id, isTyping: event.target.value !== '' });

    if (event.target.value === '') {
      setIsTyping(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col">
      <div className="flex items-center p-4 border-b">
        <img
          src={selectedUser.profilePic || "/placeholder-user.jpg"}
          alt={selectedUser.username}
          className="w-10 h-10 rounded-full mr-4"
        />
        <div>
          <p className="font-bold">
            {selectedUser.username} {isTyping && <span className="text-green-500">• Typing...</span>}
          </p>
        </div>
      </div>
      <div id="chat-window" className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.senderId === currentUser.id ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-4 rounded-lg ${message.senderId === currentUser.id ? 'bg-red-500 text-white' : 'bg-gray-200 text-black'}`}>
              {message.content}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(message.createdAt).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Type your message here"
            className="flex-1 p-2 border border-gray-400 rounded"
            onKeyDown={handleSendMessage}
            onChange={handleTyping}
          />
          <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSendMessage}>
            <FaPaperPlane className="h-5 w-5" />
          </button>
        </div>
      </div>
    </main>
  );
}

export default ChatWindow;
