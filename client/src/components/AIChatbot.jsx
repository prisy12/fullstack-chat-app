import { useState, useEffect, useRef } from "react";
// import axios from "axios";
import { axiosInstance } from "../lib/axios";

const AIChatbox = ({ userId }) => {
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSend = async () => {
    if (!userMessage.trim()) return;

    try {
      const res = await axiosInstance.post("/api/aiChat", { userId, prompt: userMessage });

      const userMsg = {
        _id: res.data.userMessageId,
        role: "user",
        text: userMessage,
      };

      const aiMsg = {
        _id: res.data.aiMessageId,
        role: "assistant",
        text: res.data.reply || "No reply",
      };

      setChatHistory((prev) => [...prev, userMsg, aiMsg]);
      setUserMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/aiChat/${id}`);
      setChatHistory((prev) => prev.filter((msg) => msg._id !== id));
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  return (
    <div className="p-4 border rounded shadow max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">AI Chatbot</h2>

      <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px] border p-2 mb-4 rounded bg-gray-50">
        {chatHistory.map((msg) => (
          <div
            key={msg._id}
            className={`group mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block px-3 py-2 rounded relative ${
                msg.role === "user" ? "bg-blue-100" : "bg-green-100"
              }`}
            >
              {msg.text}

              {/* Show delete button only for user messages */}
              {msg.role === "user" && (
                <button
                  onClick={() => handleDelete(msg._id)}
                  className="absolute -top-1 -right-1 text-xs text-red-500 bg-white border rounded px-1 opacity-0 group-hover:opacity-100"
                >
                  
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex">
        <input
          type="text"
          className="flex-grow border rounded p-2 mr-2 bg-white text-black placeholder-gray-500"
          placeholder="Ask something..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChatbox;

// import { useState } from "react";
// import axios from "axios";
// import { useEffect, useRef } from "react";


// const AIChatbox = () => {
//   const [userMessage, setUserMessage] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);
//   const bottomRef = useRef(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chatHistory]);

//   const handleSend = async () => {
//     if (!userMessage.trim()) return;

//     // Show user message in UI
//     const newHistory = [...chatHistory, { role: "user", text: userMessage }];
//     setChatHistory(newHistory);

//     try {
//       const res = await axios.post("/api/aiChat", { message: userMessage });
//       const aiReply = res.data.reply;

//       setChatHistory([
//         ...newHistory,
//         { role: "assistant", text: aiReply || "No reply" },
//       ]);
//       setUserMessage("");
//     } catch (error) {
//       console.error("Error calling AI API:", error);
//       setChatHistory([
//         ...newHistory,
//         { role: "assistant", text: "Error getting response from AI." },
//       ]);
//     }
//   };

//   return (
//     <div className="p-4 border rounded shadow max-w-md mx-auto mt-6">
//       <h2 className="text-xl font-bold mb-4">AI Chatbot</h2>

//       <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px] border p-2 mb-4 rounded bg-gray-50">

//         {chatHistory.map((msg, i) => (
//           <div key={i} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
//             <span className={`inline-block px-3 py-2 rounded ${msg.role === "user" ? "bg-blue-100" : "bg-green-100"}`}>
//               {msg.text}
//             </span>
//           </div>
//         ))}
//         <div ref={bottomRef} /> {/* 👈 Auto-scroll anchor */}
//       </div>
//       <div className="flex">
//         <input
//           type="text"
//           className="flex-grow border rounded p-2 mr-2 bg-white text-black placeholder-gray-500"
//           placeholder="Ask something..."
//           value={userMessage}
//           onChange={(e) => setUserMessage(e.target.value)}
//         />

//         <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSend}>
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AIChatbox;
