/* eslint-disable react/prop-types */
import { useState } from 'react';

function Register({ setCurrentUser }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = () => {
    if (!username) {
      setError('Username is required');
      return;
    }

    fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setSuccess('Registration successful! You can now log in.');
          setCurrentUser(data); // Optionally set the user to auto-login after registration
        }
      })
      .catch(err => {
        setError('An error occurred during registration');
        console.error(err);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
        className="mb-2 p-2 border border-gray-400 rounded"
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}
      <button
        onClick={handleRegister}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Register
      </button>
    </div>
  );
}

export default Register;
