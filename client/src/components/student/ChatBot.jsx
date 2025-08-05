// components/ChatBot.jsx
import React, { useState } from 'react';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `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`, // ⚠️ Replace this with your key only for testing!
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: newMessages,
        }),
      });

      const data = await response.json();

      const botMessage = data.choices[0].message;
      setMessages([...newMessages, botMessage]);
    } catch (error) {
      console.error('OpenAI API error:', error);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow max-w-md mx-auto">
      <div className="h-64 overflow-y-auto border p-2 mb-2 bg-gray-100">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span
              className={`inline-block p-2 rounded ${
                msg.role === 'user' ? 'bg-blue-200' : 'bg-gray-300'
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded p-2"
          placeholder="Ask something..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
