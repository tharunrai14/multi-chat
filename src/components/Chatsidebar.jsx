/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { FaSearch, FaInbox, FaArchive, FaBan } from 'react-icons/fa';
import io from 'socket.io-client';

function Sidebar({ setSelectedUser, filter, setFilter }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const socket = io('https://chat-backendd-aff9218c1774.herokuapp.com/');
    
    socket.on('userStatus', ({ userId, online }) => {
      setUsers((prevUsers) => 
        prevUsers.map((user) =>
          user.id === userId ? { ...user, online } : user
        )
      );
    });

    fetch('https://chat-backendd-aff9218c1774.herokuapp.com/users')
      .then(response => response.json())
      .then(data => {
        const sortedUsers = data.sort((a, b) => b.unreadMessages - a.unreadMessages);
        setUsers(sortedUsers);
      })
      .catch(err => console.error(err));

    return () => {
      socket.disconnect();
    };
  }, []);

  const filteredUsers = users.filter(user => {
    if (filter !== 'All' && user.online !== (filter === 'Online')) return false;
    if (!user.username.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <aside className="w-1/3 border-r">
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full p-2 border border-gray-400 rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-400" />
        </div>
      </div>
      <div className="flex justify-around p-2 border-b">
        <button
          className={`px-2 py-1 rounded ${filter === 'All' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('All')}
        >
          <FaInbox className="inline mr-1" /> All
        </button>
        <button
          className={`px-2 py-1 rounded ${filter === 'Unread' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('Unread')}
        >
          <FaInbox className="inline mr-1" /> Unread
        </button>
        <button
          className={`px-2 py-1 rounded ${filter === 'Archived' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('Archived')}
        >
          <FaArchive className="inline mr-1" /> Archived
        </button>
        <button
          className={`px-2 py-1 rounded ${filter === 'Blocked' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('Blocked')}
        >
          <FaBan className="inline mr-1" /> Blocked
        </button>
      </div>
      <div className="overflow-y-auto">
        {filteredUsers.map((user, index) => (
          <div key={index} className="flex items-center p-4 border-b" onClick={() => setSelectedUser(user)}>
            <img
              src={user.profilePic || "/placeholder-user.jpg"}
              alt={user.username}
              className="w-10 h-10 rounded-full mr-4"
            />
            <div>
              <p className="font-bold">
                {user.username} <span className="text-muted-foreground">• {user.lastMessageTime}</span>
              </p>
              <p className="text-muted-foreground">{user.lastMessage}</p>
              <p className="text-xs text-gray-400">{user.online ? 'Online' : 'Offline'}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
