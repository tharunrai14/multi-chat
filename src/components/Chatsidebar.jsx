/* eslint-disable react/prop-types */
import  { useEffect, useState } from 'react';

function Sidebar({ setSelectedUser, filter, setFilter }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('https://chat-backendd-aff9218c1774.herokuapp.com/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

  const filteredUsers = users.filter(user => {
    if (filter !== 'All' && user.online !== (filter === 'Online')) return false;
    if (!user.username.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <aside className="w-1/4 bg-gray-100 p-4 border-r border-gray-300">
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-400 rounded"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex justify-around mb-4">
        {['All', 'Online', 'Offline'].map(status => (
          <button
            key={status}
            className={`px-2 py-1 rounded ${filter === status ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>
      <div className="overflow-y-auto">
        {filteredUsers.map(user => (
          <div
            key={user.id}
            className={`flex items-center p-2 mb-2 cursor-pointer hover:bg-gray-200`}
            onClick={() => setSelectedUser(user)}
          >
            <img src={user.profilePic || 'default-profile-pic-url'} alt="Profile" className="w-10 h-10 rounded-full mr-3" />
            <div>
              <p className="font-bold">{user.username}</p>
              <p className="text-sm text-gray-500">Last message...</p> {/* You can update this with actual last message */}
              <p className="text-xs text-gray-400">{user.online ? 'Online' : 'Offline'}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
