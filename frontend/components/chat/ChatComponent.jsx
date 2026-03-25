'use client';
import { useState, useEffect, useRef } from 'react';
import { chatAPI } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function ChatComponent({ appointmentId, userRole, userName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  // Fetch messages on mount and periodically
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [appointmentId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const data = await chatAPI.getMessages(appointmentId, 50, 1);
      setMessages(data.messages || []);
      
      // Mark unread messages as read
      data.messages?.forEach((msg) => {
        if (!msg.isRead && msg.sender !== localStorage.getItem('userId')) {
          chatAPI.markAsRead(appointmentId, msg._id).catch(() => {});
        }
      });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    setLoading(true);
    try {
      await chatAPI.sendMessage(appointmentId, newMessage);
      setNewMessage('');
      await fetchMessages();
      toast.success('Message sent');
    } catch (error) {
      toast.error(error.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg h-[500px] flex flex-col bg-white">
      {/* Header */}
      <div className="bg-blue-50 p-4 border-b">
        <h3 className="font-semibold text-lg">Chat with Doctor</h3>
        <p className="text-sm text-gray-600">Secure appointment messaging</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.senderRole === 'doctor' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.senderRole === 'doctor'
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-green-100 text-green-900'
                }`}
              >
                <p className="font-semibold text-sm mb-1">
                  {msg.senderRole === 'doctor' ? 'Dr.' : ''} {msg.senderRole}
                </p>
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs mt-1 opacity-70">
                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                </p>
                {msg.isRead && (
                  <p className="text-xs opacity-50 mt-1">✓✓ Read</p>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="border-t p-4 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
