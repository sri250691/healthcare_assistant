import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, RotateCcw } from 'lucide-react';
import { useChat } from './hooks/useChat';
import { ChatMessage } from './components/ChatMessage';
import { AgentIndicator } from './components/AgentIndicator';
import { FileUpload } from './components/FileUpload';
import { QuickActions } from './components/QuickActions';
import { ChatHistory } from './components/ChatHistory';

const App: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, isLoading, currentAgent, conversations, sendMessage, uploadFile, clearChat } = useChat();
  
  // Debug: Log when the current agent changes
  useEffect(() => {
    console.log("Current agent in App.tsx:", currentAgent);
  }, [currentAgent]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      console.log("Sending message:", inputMessage);
      await sendMessage(inputMessage);
      setInputMessage('');
      setShowFileUpload(false);
    }
  };

  const handleQuickAction = async (message: string) => {
    await sendMessage(message);
  };

  const handleFileUpload = async (file: File) => {
    await uploadFile(file);
    setShowFileUpload(false);
  };

  return (
    <div className="min-h-screen bg-ey-black flex">
      {/* Left Sidebar - Quick Actions */}
      <div className="w-80 bg-ey-darkgray border-r border-healthcare-primary p-4 overflow-y-auto">
        <div className="mb-6">
          {/* Healthcare Logo */}
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-healthcare-primary rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xl">🏥</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-healthcare-primary">
                Healthcare Assistant
              </h1>
              <p className="text-sm text-ey-lightgray">
                AI-powered multi-agent support system
              </p>
            </div>
          </div>
          <div className="text-xs text-ey-lightgray opacity-75">
            Powered by EYQ Incubator
          </div>
        </div>

        <QuickActions onQuickAction={handleQuickAction} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-ey-black">
        {/* Header with Agent Status */}
        <div className="bg-ey-darkgray border-b border-healthcare-primary p-4">
          <div className="flex items-center justify-between">
            <AgentIndicator 
              currentAgent={currentAgent} 
              isLoading={isLoading} 
              metadata={messages.length > 0 && messages[messages.length-1].role === 'assistant' ? messages[messages.length-1].metadata : undefined}
            />

            <button
              onClick={clearChat}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-ey-lightgray hover:text-healthcare-primary hover:bg-ey-black rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>New Chat</span>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-ey-black">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence>
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-healthcare-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">🏥</span>
                  </div>
                  <h2 className="text-2xl font-bold text-healthcare-primary mb-2">
                    Welcome to Healthcare Assistant
                  </h2>
                  <p className="text-ey-lightgray mb-6">
                    Your AI-powered support system with specialized agents
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                    {[
                      { icon: '🏥', label: 'Medical Help', message: 'What symptoms require emergency care?' },
                      { icon: '💊', label: 'Medications', message: 'Can you explain how antibiotics work?' },
                      { icon: '🩺', label: 'Treatments', message: 'What are common treatments for hypertension?' },
                      { icon: '📋', label: 'Patient Info', message: 'What questions should I ask my doctor?' }
                    ].map((item, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleQuickAction(item.message)}
                        className="p-4 bg-ey-darkgray rounded-lg border border-healthcare-primary hover:border-healthcare-primary hover:shadow-lg hover:shadow-healthcare-primary/20 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="text-2xl mb-2">{item.icon}</div>
                        <div className="text-sm font-medium text-healthcare-primary">{item.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                </div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* File Upload Area */}
        <AnimatePresence>
          {showFileUpload && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-ey-yellow p-4 bg-ey-darkgray"
            >
              <div className="max-w-4xl mx-auto">
                <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <div className="bg-ey-darkgray border-t border-healthcare-primary p-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
              <div className="flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything about healthcare, treatments, medications..."
                  className="w-full px-4 py-3 bg-ey-black border border-healthcare-primary rounded-lg focus:ring-2 focus:ring-healthcare-primary focus:border-transparent text-ey-lightgray placeholder-ey-lightgray resize-none"
                  disabled={isLoading}
                />
              </div>

              <button
                type="button"
                onClick={() => setShowFileUpload(!showFileUpload)}
                className={`p-3 rounded-lg border transition-colors ${showFileUpload
                    ? 'bg-healthcare-primary text-white border-healthcare-primary'
                    : 'bg-ey-darkgray text-ey-lightgray border-healthcare-primary hover:bg-healthcare-primary hover:text-white'
                  }`}
                disabled={isLoading}
                aria-label="Upload file"
                title="Upload file"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="px-6 py-3 bg-healthcare-primary text-white rounded-lg hover:bg-healthcare-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                aria-label="Send message"
                title="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Chat History & Sources */}
      <div className="w-80 bg-ey-darkgray border-l border-healthcare-primary p-4 overflow-y-auto">
        <ChatHistory
          conversations={conversations}
          currentConversationId={conversations.length > 0 ? conversations[0].id : undefined}
          onSelectConversation={(id) => console.log('Select conversation:', id)}
        />
        
        {/* Agent Information Panel */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-healthcare-primary mb-3">Active Agents</h3>
          <div className="space-y-2">
            {Array.from(new Set(messages
              .filter(m => m.agent)
              .map(m => m.agent)))
              .map((agent, index) => (
                <div key={index} className="p-3 bg-ey-black rounded-lg border border-healthcare-primary/20">
                  <div className="text-xs font-medium text-healthcare-primary mb-1">
                    {agent} Agent
                  </div>
                  <div className="text-xs text-ey-lightgray">
                    {messages.find(m => m.metadata?.invoked_agent_reason && m.agent === agent)?.metadata?.invoked_agent_reason || 
                    `Selected based on message content analysis`}
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Sources Panel */}
        {messages.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-healthcare-primary mb-3">Recent Sources</h3>
            <div className="space-y-2">
              {messages
                .filter(m => m.sources && m.sources.length > 0)
                .slice(-3)
                .map((message, index) => (
                  <div key={index} className="p-3 bg-ey-black rounded-lg border border-healthcare-primary/20">
                    <div className="text-xs font-medium text-healthcare-primary mb-1">
                      {message.agent} Agent Response
                    </div>
                    {message.sources?.slice(0, 2).map((source, sourceIndex) => (
                      <div key={sourceIndex} className="text-xs text-ey-lightgray mb-1">
                        📎 {source.title}
                        {source.confidence && (
                          <span className="ml-1 text-ey-lightgray/75">
                            ({Math.round(source.confidence * 100)}%)
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;