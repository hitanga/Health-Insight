import React, { useState, useEffect } from 'react';
import { Mail, Check, Trash2, MailOpen, AlertCircle, Loader2, Calendar } from 'lucide-react';
import { getContactMessages, markMessageRead, deleteMessage } from '../../services/contactService';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateStr;
  }
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const loadMessages = async () => {
    try {
      const data = await getContactMessages();
      setMessages(data);
    } catch (err) {
      console.error('Failed to load contact messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleToggleRead = async (msg) => {
    const newStatus = !msg.read;
    await markMessageRead(msg.id, newStatus);
    setMessages(messages.map(m => m.id === msg.id ? { ...m, read: newStatus } : m));
    if (selectedMessage?.id === msg.id) {
      setSelectedMessage(prev => ({ ...prev, read: newStatus }));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this message permanently?')) {
      await deleteMessage(id);
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#80C8C9] animate-spin mb-3" />
        <p className="text-xs text-gray-500">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#202324] tracking-tight">
          Contact Messages
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Inquiries and correspondence sent through the public contact form.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Messages List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-[6px] border border-gray-200/80 shadow-2xs overflow-hidden">
          <div className="p-3.5 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-700">Inbox ({messages.length})</span>
            <span className="text-gray-400 text-[11px]">
              {messages.filter(m => !m.read).length} unread
            </span>
          </div>

          {messages.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-xs">
              <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No messages received yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[560px] overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (!msg.read) handleToggleRead(msg);
                  }}
                  className={`p-3.5 cursor-pointer transition-colors text-xs ${
                    selectedMessage?.id === msg.id
                      ? 'bg-gray-100'
                      : !msg.read
                      ? 'bg-blue-50/40 hover:bg-blue-50/70'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`truncate font-medium ${!msg.read ? 'text-[#202324] font-bold' : 'text-gray-700'}`}>
                      {msg.name}
                    </span>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                  <div className="font-semibold text-gray-900 truncate mb-1">
                    {msg.subject || 'General Inquiry'}
                  </div>
                  <p className="text-gray-500 line-clamp-2 text-[11px] leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Message Viewer (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-[6px] border border-gray-200/80 shadow-2xs p-6 min-h-[300px]">
          {selectedMessage ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-[#202324] mb-1">
                    {selectedMessage.subject || 'General Inquiry'}
                  </h2>
                  <div className="text-xs text-gray-500 space-y-0.5">
                    <p>
                      <strong>From:</strong> {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                    </p>
                    <p className="text-gray-400 text-[11px]">
                      Received: {formatDate(selectedMessage.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleRead(selectedMessage)}
                    title={selectedMessage.read ? 'Mark unread' : 'Mark read'}
                    className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    {selectedMessage.read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4 text-[#80C8C9]" />}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    title="Delete message"
                    className="p-1.5 rounded hover:bg-rose-50 text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Content */}
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50/60 p-4 rounded border border-gray-100">
                {selectedMessage.message}
              </div>

              {/* Reply Button */}
              <div className="pt-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Inquiry')}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#202324] hover:bg-black text-white text-xs font-semibold rounded transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#80C8C9]" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400 text-xs">
              <Mail className="w-10 h-10 mb-2 opacity-40" />
              <p>Select a message from the list to view its contents.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
