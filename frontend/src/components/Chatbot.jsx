import React, { useEffect, useState } from 'react';
import { X, Bot, User } from 'lucide-react';

const Chatbot = () => {
  const [chat, setChat] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setChat([
      {
        sender: 'bot',
        text: "👋 Hi! I'm your ScrubsPlus Assistant. Upload a photo for AI suggestions or type something like:\n• Track order ID 665e190e3b1234567890abcd\n• Suggest scrubs for my glow type",
      },
    ]);
  }, []);

  const parseReplyLines = (lines) => {
    return lines.map((line) => {
      if (line.startsWith('🛍️')) {
        const match = line.match(/^🛍️ (.+?) – \$([\d.]+)\s?\|\s?(.+)/);
        if (match) {
          return {
            sender: 'bot',
            isProduct: true,
            name: match[1],
            price: match[2],
            id: match[3],
            text: line,
          };
        }
      }
      return { sender: 'bot', text: line };
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setChat((prev) => [...prev, { sender: 'user', text: '🖼️ Uploaded a photo for suggestion.' }]);
    setIsTyping(true);
    setUploading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/chatbot/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.reply) {
        const lines = data.reply.split('\n').filter((line) => line.trim());
        const parsed = parseReplyLines(lines);

        setChat((prev) => [
          ...prev,
          { sender: 'bot', text: data.message || '📸 Here are some AI recommendations:' },
          ...parsed,
        ]);
      } else {
        setChat((prev) => [
          ...prev,
          { sender: 'bot', text: '😕 Sorry, I couldn’t find any good matches. Try a different photo?' },
        ]);
      }
    } catch (err) {
      console.error(err);
      setChat((prev) => [...prev, { sender: 'bot', text: '❌ Something went wrong. Try again later.' }]);
    }

    setUploading(false);
    setIsTyping(false);
  };

  const handleSendText = async () => {
    if (!message.trim()) return;

    setChat((prev) => [...prev, { sender: 'user', text: message }]);
    setIsTyping(true);
    setMessage('');

    try {
      const res = await fetch('/api/chatbot/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      const lines = data.reply?.split('\n').filter((line) => line.trim()) || [];
      const parsed = parseReplyLines(lines);

      setChat((prev) => [...prev, ...parsed]);
    } catch (err) {
      console.error(err);
      setChat((prev) => [...prev, { sender: 'bot', text: '⚠️ Failed to get a response from ChatGPT.' }]);
    }

    setIsTyping(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg text-sm z-50"
      >
        💬 Chat with ScrubsPlus
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 sm:w-96 bg-white border border-gray-300 shadow-2xl rounded-lg flex flex-col z-50">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center rounded-t-lg">
        <span className="font-semibold text-sm">👗 ScrubsPlus Assistant</span>
        <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">
          <X size={18} />
        </button>
      </div>

      {/* Chat Display */}
      <div className="h-72 overflow-y-auto px-4 py-3 text-sm bg-white space-y-3">
        {chat.map((msg, index) => (
          msg.isProduct ? (
            <div key={index} className="flex justify-start">
              <div className="border border-gray-200 rounded-lg p-3 shadow max-w-[85%] bg-white">
                <p className="font-semibold text-blue-800 text-sm">{msg.name}</p>
                <p className="text-sm text-gray-700 mt-1">${msg.price}</p>
                {msg.id && (
                  <a
                    href={`/product/${msg.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-blue-600 text-xs hover:underline"
                  >
                    View Product
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="flex gap-2 max-w-[85%]">
                {msg.sender === 'bot' && <div className="p-1 rounded-full bg-blue-100"><Bot size={16} /></div>}
                <div className={`px-3 py-2 rounded-md whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}>
                  {msg.text}
                </div>
                {msg.sender === 'user' && <div className="p-1 rounded-full bg-gray-300"><User size={16} /></div>}
              </div>
            </div>
          )
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-sm text-gray-400 animate-pulse">
            <Bot size={14} />
            <span>ScrubsPlus is typing...</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t bg-gray-50 space-y-2">
        <label className="cursor-pointer text-sm bg-blue-600 text-white px-4 py-1 rounded-md inline-block">
          Upload Photo
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>

        <div className="flex gap-2 mt-1">
          <input
            type="text"
            placeholder="Ask me anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow border p-2 rounded text-sm"
          />
          <button
            onClick={handleSendText}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
