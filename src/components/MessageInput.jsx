// import { useState } from 'react';

// // eslint-disable-next-line react/prop-types
// const MessageInput = ({ onSendMessage }) => {
//   const [message, setMessage] = useState('');

//   const handleSend = () => {
//     if (message.trim()) {
//       onSendMessage(message);
//       setMessage('');
//     }
//   };

//   return (
//     <div className="flex border-t border-gray-300 p-2">
//       <input
//         type="text"
//         placeholder="Type your message here..."
//         value={message}
//         className='flex-1 p-2 border border-gray-300 rounded'
//         onChange={(e) => setMessage(e.target.value)}
//         onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//       />
//       <button  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer" onClick={handleSend}>Send</button>
//     </div>
//   );
// };

// export default MessageInput;
