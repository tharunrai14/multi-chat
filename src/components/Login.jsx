/* eslint-disable react/prop-types */
import { useState } from 'react';

function Login({ setCurrentUser }) {
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    fetch('https://chat-backendd-aff9218c1774.herokuapp.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          setCurrentUser(data);
        }
      });
  };

  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Login
      </button>
    </div>
  );
}

export default Login;
