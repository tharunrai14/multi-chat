import  { useState } from 'react';
import Sidebar from './components/Chatsidebar';
import ChatWindow from './components/ChatWindow';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [currentUser, setCurrentUser] = useState(null); // Track the logged-in user
  const [selectedUser, setSelectedUser] = useState(null);
  const [filter, setFilter] = useState('All');
  const [isRegistering, setIsRegistering] = useState(false); // Track registration state

  if (!currentUser) {
    return (
      <div className="flex h-screen justify-center items-center">
        {isRegistering ? (
          <Register setCurrentUser={setCurrentUser} />
        ) : (
          <Login setCurrentUser={setCurrentUser} />
        )}
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="absolute top-4 right-4 px-4 py-2 bg-gray-300 rounded"
        >
          {isRegistering ? 'Go to Login' : 'Register'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        currentUser={currentUser} // Pass current user to the Sidebar
        setSelectedUser={setSelectedUser}
        filter={filter}
        setFilter={setFilter}
      />
      {selectedUser ? (
        <ChatWindow currentUser={currentUser} selectedUser={selectedUser} />
      ) : (
        <div className="flex-1 flex justify-center items-center">
          <p>Select a user to start chatting</p>
        </div>
      )}
    </div>
  );
}

export default App;
