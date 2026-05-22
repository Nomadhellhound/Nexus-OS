/**
 * Email Widget — Integrated Email Management
 * Void Interface Design System
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Archive, Trash2, Reply, ChevronDown } from 'lucide-react';

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  body?: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
}

const SAMPLE_EMAILS: Email[] = [
  {
    id: '1',
    from: 'team@company.com',
    subject: 'Project Update - Q2 Goals',
    preview: 'Here are the updated Q2 goals for the team...',
    body: 'Here are the updated Q2 goals for the team. Please review and provide feedback by EOD Friday.',
    timestamp: new Date(Date.now() - 3600000),
    read: false,
    starred: true,
  },
  {
    id: '2',
    from: 'client@example.com',
    subject: 'Feedback on Design Mockups',
    preview: 'The mockups look great! A few minor adjustments...',
    body: 'The mockups look great! A few minor adjustments needed on the dashboard section.',
    timestamp: new Date(Date.now() - 7200000),
    read: false,
    starred: false,
  },
  {
    id: '3',
    from: 'support@service.com',
    subject: 'Account Verification',
    preview: 'Please verify your account to continue...',
    body: 'Please verify your account to continue using our service.',
    timestamp: new Date(Date.now() - 86400000),
    read: true,
    starred: false,
  },
];

export function EmailWidget() {
  const [emails, setEmails] = useState<Email[]>(SAMPLE_EMAILS);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(emails[0]);
  const [replyText, setReplyText] = useState('');
  const [showReply, setShowReply] = useState(false);

  const handleReply = () => {
    if (!replyText.trim() || !selectedEmail) return;

    const newEmail: Email = {
      id: `email-${Date.now()}`,
      from: 'you@company.com',
      subject: `Re: ${selectedEmail.subject}`,
      preview: replyText,
      body: replyText,
      timestamp: new Date(),
      read: true,
      starred: false,
    };

    setEmails(prev => [newEmail, ...prev]);
    setReplyText('');
    setShowReply(false);
  };

  const handleMarkAsRead = (id: string) => {
    setEmails(prev =>
      prev.map(e => (e.id === id ? { ...e, read: true } : e))
    );
  };

  const handleDelete = (id: string) => {
    setEmails(prev => prev.filter(e => e.id !== id));
    if (selectedEmail?.id === id) {
      setSelectedEmail(emails.find(e => e.id !== id) || null);
    }
  };

  const unreadCount = emails.filter(e => !e.read).length;

  return (
    <div className="w-full h-full flex bg-gradient-to-b from-slate-950 to-slate-900 rounded-lg border border-cyan-500/20 overflow-hidden">
      {/* Email List */}
      <div className="w-40 border-r border-cyan-500/10 flex flex-col">
        <div className="p-3 border-b border-cyan-500/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono text-cyan-400">INBOX</h3>
            {unreadCount > 0 && (
              <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 p-2">
          {emails.map(email => (
            <motion.button
              key={email.id}
              onClick={() => {
                setSelectedEmail(email);
                handleMarkAsRead(email.id);
              }}
              whileHover={{ x: 4 }}
              className={`w-full text-left p-2 rounded transition-colors ${
                selectedEmail?.id === email.id
                  ? 'bg-cyan-500/20 border-l-2 border-cyan-400'
                  : 'hover:bg-cyan-500/10'
              }`}
            >
              <div className="flex items-start gap-1 min-w-0">
                {!email.read && (
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-cyan-400 truncate">
                    {email.from.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500 truncate line-clamp-1">
                    {email.subject}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 flex flex-col">
        {selectedEmail ? (
          <>
            {/* Email Header */}
            <div className="px-4 py-3 border-b border-cyan-500/10 bg-slate-900/50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-cyan-400 truncate">
                    {selectedEmail.from}
                  </p>
                  <h2 className="text-sm text-gray-300 font-medium mt-1">
                    {selectedEmail.subject}
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">
                    {selectedEmail.timestamp.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button className="p-1 hover:bg-cyan-500/10 rounded transition-colors">
                    <Archive className="w-3 h-3 text-cyan-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(selectedEmail.id)}
                    className="p-1 hover:bg-red-500/10 rounded transition-colors"
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Email Body */}
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-xs text-gray-300 leading-relaxed">
                {selectedEmail.body || selectedEmail.preview}
              </p>
            </div>

            {/* Reply Section */}
            <div className="border-t border-cyan-500/10 bg-slate-900/50 p-3">
              {!showReply ? (
                <button
                  onClick={() => setShowReply(true)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded border border-cyan-500/20 text-xs text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                >
                  <Reply className="w-3 h-3" />
                  Reply
                </button>
              ) : (
                <div className="space-y-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="w-full bg-slate-800 text-cyan-400 text-xs px-2 py-2 rounded border border-cyan-500/20 outline-none focus:border-cyan-500/50 placeholder-gray-600 resize-none h-16"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleReply}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded hover:bg-cyan-500/30 transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      Send
                    </button>
                    <button
                      onClick={() => setShowReply(false)}
                      className="px-2 py-1 text-gray-500 text-xs rounded hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-xs">
            No email selected
          </div>
        )}
      </div>
    </div>
  );
}
