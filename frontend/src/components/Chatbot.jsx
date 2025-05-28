import React, { useEffect, useState } from 'react';
import { X, Bot, User } from 'lucide-react';

const Chatbot = () => {
  const [chat, setChat] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  // ✅ Welcome message on load
  useEffect(() => {
    setChat([
      {
        sender: 'bot',
        text: "👋 Hi there! I'm ScrubsPlus Assistant — your personal style assistant. Upload a photo and I’ll recommend the best products based on your complexion!",
      },
    ]);
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setChat((prev) => [...prev, { sender: 'user', text: '🖼️ Uploaded a photo.' }]);
    setIsTyping(true);
    setUploading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:4000/api/chatbot/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.products?.length) {
        setChat((prev) => [
          ...prev,
          { sender: 'bot', text: data.message },
          ...data.products.map((p) => ({
            sender: 'bot',
            text: `🛍️ ${p.name} – $${p.price}`,
          })),
        ]);
      } else {
        setChat((prev) => [
          ...prev,
          { sender: 'bot', text: 'Hmm... I couldn’t find any perfect matches. Try another photo?' },
        ]);
      }
    } catch (err) {
      console.error(err);
      setChat((prev) => [
        ...prev,
        { sender: 'bot', text: 'Something went wrong. Please try again later.' },
      ]);
    }

    setIsTyping(false);
    setUploading(false);
  };

  // ✅ Closed view
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg text-sm z-50"
      >
        💬 Chat with FashBot
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 sm:w-96 bg-white border border-gray-300 shadow-2xl rounded-lg flex flex-col z-50">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center rounded-t-lg">
        <span className="font-semibold text-sm">👗 FashBot – Style Assistant</span>
        <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">
          <X size={18} />
        </button>
      </div>

      {/* Chat Window */}
      <div className="h-72 overflow-y-auto px-4 py-3 text-sm bg-white space-y-3">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex gap-2 max-w-[85%]">
              {msg.sender === 'bot' && (
                <div className="p-1 rounded-full bg-blue-100">
                  <Bot size={16} />
                </div>
              )}
              <div
                className={`px-3 py-2 rounded-md whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-blue-100 text-right'
                    : 'bg-gray-100 text-left'
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === 'user' && (
                <div className="p-1 rounded-full bg-gray-300">
                  <User size={16} />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Animation */}
        {isTyping && (
          <div className="flex items-center gap-2 text-sm text-gray-400 animate-pulse">
            <Bot size={14} />
            <span>FashBot is typing...</span>
          </div>
        )}
      </div>

      {/* Upload Footer */}
      <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
        <label className="cursor-pointer text-sm bg-blue-600 text-white px-4 py-1 rounded-md">
          Upload Photo
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default Chatbot;
