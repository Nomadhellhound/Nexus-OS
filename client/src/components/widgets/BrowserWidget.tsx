/**
 * Browser Widget — Embedded Web Browser
 * Void Interface Design System
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, ArrowLeft, ArrowRight, RotateCcw, X } from 'lucide-react';

interface BrowserTab {
  id: string;
  url: string;
  title: string;
  favicon: string;
}

export function BrowserWidget() {
  const [tabs, setTabs] = useState<BrowserTab[]>([
    { id: '1', url: 'https://google.com', title: 'Google', favicon: '🔍' },
    { id: '2', url: 'https://github.com', title: 'GitHub', favicon: '🐙' },
    { id: '3', url: 'https://claude.ai', title: 'Claude', favicon: '🤖' },
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [urlInput, setUrlInput] = useState(tabs[0].url);
  const [isLoading, setIsLoading] = useState(false);

  const activeTab = tabs.find(t => t.id === activeTabId);

  const handleNavigate = () => {
    if (!urlInput.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const updatedTabs = tabs.map(t =>
        t.id === activeTabId
          ? { ...t, url: urlInput, title: new URL(urlInput).hostname }
          : t
      );
      setTabs(updatedTabs);
    }, 1000);
  };

  const handleNewTab = () => {
    const newTab: BrowserTab = {
      id: `tab-${Date.now()}`,
      url: 'about:blank',
      title: 'New Tab',
      favicon: '📄',
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setUrlInput('');
  };

  const handleCloseTab = (id: string) => {
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id && newTabs.length > 0) {
      setActiveTabId(newTabs[0].id);
      setUrlInput(newTabs[0].url);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-slate-950 to-slate-900 rounded-lg border border-cyan-500/20 overflow-hidden">
      {/* Tab Bar */}
      <div className="flex items-center gap-1 px-3 py-2 bg-slate-900/50 border-b border-cyan-500/10 overflow-x-auto">
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => {
              setActiveTabId(tab.id);
              setUrlInput(tab.url);
            }}
            whileHover={{ scale: 1.05 }}
            className={`flex items-center gap-2 px-3 py-1 rounded text-xs whitespace-nowrap transition-colors ${
              activeTabId === tab.id
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
            }`}
          >
            <span>{tab.favicon}</span>
            <span className="max-w-20 truncate">{tab.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCloseTab(tab.id);
              }}
              className="ml-1 hover:text-red-400"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.button>
        ))}
        <button
          onClick={handleNewTab}
          className="px-2 py-1 text-gray-500 hover:text-cyan-400 transition-colors text-xs"
        >
          +
        </button>
      </div>

      {/* Address Bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 border-b border-cyan-500/10">
        <button className="p-1 hover:bg-cyan-500/10 rounded transition-colors">
          <ArrowLeft className="w-3 h-3 text-cyan-400" />
        </button>
        <button className="p-1 hover:bg-cyan-500/10 rounded transition-colors">
          <ArrowRight className="w-3 h-3 text-cyan-400" />
        </button>
        <button
          onClick={() => handleNavigate()}
          className="p-1 hover:bg-cyan-500/10 rounded transition-colors"
        >
          <RotateCcw className="w-3 h-3 text-cyan-400" />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-slate-800 rounded px-2 py-1 border border-cyan-500/20">
          <Globe className="w-3 h-3 text-cyan-400" />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleNavigate();
            }}
            placeholder="Enter URL..."
            className="flex-1 bg-transparent text-cyan-400 text-xs outline-none placeholder-gray-600"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden bg-slate-950 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full"
            />
          </div>
        )}
        <div className="w-full h-full flex items-center justify-center text-center p-4">
          <div className="space-y-2">
            <Globe className="w-8 h-8 text-cyan-400 mx-auto opacity-50" />
            <p className="text-xs text-gray-500">
              {activeTab?.url === 'about:blank'
                ? 'New Tab'
                : `Displaying: ${activeTab?.title}`}
            </p>
            <p className="text-xs text-gray-600">
              {activeTab?.url}
            </p>
            <p className="text-xs text-gray-700 mt-4">
              Browser widget displays web content in an embedded view
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
