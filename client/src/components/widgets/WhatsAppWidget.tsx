/**
 * WhatsApp Widget — Integrated Messaging
 * Void Interface Design System
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Phone, Video } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'contact';
  content: string;
  timestamp: Date;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: Date;
}

const SAMPLE_CONTACTS: Contact[] = [
  { id: '1', name: 'Team Lead', avatar: '👨‍💼', status: 'online', lastSeen: new Date() },
  { id: '2', name: 'Designer', avatar: '🎨', status: 'online', lastSeen: new Date() },
  { id: '3', name: 'Developer', avatar: '👨‍💻', status: 'away', lastSeen: new Date(Date.now() - 300000) },
];

export function WhatsAppWidget() {
  const [selectedContact, setSelectedContact] = useState<Contact>(SAMPLE_CONTACTS[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'contact',
      content: 'Hey! How is the project going?',
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: '2',
      sender: 'user',
      content: 'Going great! Just finished the UI updates',
      timestamp: new Date(Date.now() - 240000),
    },
    {
      id: '3',
      sender: 'contact',
      content: 'Awesome! Can you share the latest version?',
      timestamp: new Date(Date.now() - 120000),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full h-full flex bg-gradient-to-b from-slate-950 to-slate-900 rounded-lg border border-cyan-500/20 overflow-hidden">
      {/* Contacts Sidebar */}
      <div className="w-32 border-r border-cyan-500/10 flex flex-col">
        <div className="p-3 border-b border-cyan-500/10">
          <h3 className="text-xs font-mono text-cyan-400">CHATS</h3>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 p-2">
          {SAMPLE_CONTACTS.map(contact => (
            <motion.button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              whileHover={{ x: 4 }}
              className={`w-full text-left p-2 rounded transition-colors ${
                selectedContact.id === contact.id
                  ? 'bg-cyan-500/20 border-l-2 border-cyan-400'
                  : 'hover:bg-cyan-500/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{contact.avatar}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-cyan-400 truncate">
                    {contact.name}
                  </p>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${getStatusColor(
                        contact.status
                      )}`}
                    />
                    <p className="text-xs text-gray-500 truncate">
                      {contact.status}
                    </p>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/10 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="text-lg">{selectedContact.avatar}</span>
            <div>
              <p className="text-xs font-mono text-cyan-400">
                {selectedContact.name}
              </p>
              <p className="text-xs text-gray-500">
                {selectedContact.status === 'online'
                  ? 'Online'
                  : `Last seen ${Math.round((Date.now() - selectedContact.lastSeen.getTime()) / 60000)}m ago`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-cyan-500/10 rounded transition-colors">
              <Phone className="w-3 h-3 text-cyan-400" />
            </button>
            <button className="p-1 hover:bg-cyan-500/10 rounded transition-colors">
              <Video className="w-3 h-3 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-xs ${
                  msg.sender === 'user'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-slate-800 text-gray-300 border border-cyan-500/10'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-cyan-500/10 bg-slate-900/50 p-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Type a message..."
              className="flex-1 bg-slate-800 text-cyan-400 text-xs px-3 py-2 rounded border border-cyan-500/20 outline-none focus:border-cyan-500/50 placeholder-gray-600"
            />
            <button
              onClick={handleSend}
              className="p-2 hover:bg-cyan-500/20 rounded transition-colors"
            >
              <Send className="w-3 h-3 text-cyan-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
