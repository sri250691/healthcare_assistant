import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Clock } from 'lucide-react';
import { Conversation } from '../types';

interface ChatHistoryProps {
  conversations: Conversation[];
  currentConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation
}) => {
  // Use actual conversations from the chat
  const allConversations = conversations;

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const getAgentIcon = (agent: string) => {
    const icons = {
      general: '🏥',
      hr: '👥',
      it: '🔧',
      travel: '✈️',
      doc_chat: '📄'
    };
    return icons[agent as keyof typeof icons] || '🏥';
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-ey-yellow mb-3 flex items-center">
        <MessageSquare className="w-4 h-4 mr-2" />
        Recent Conversations
      </h3>
      
      {allConversations.length === 0 ? (
        <div className="text-center py-8 text-ey-lightgray">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No conversations yet. Start by asking a question!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {allConversations.slice(0, 5).map((conversation, index) => (
            <motion.button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                currentConversationId === conversation.id
                  ? 'bg-ey-yellow text-ey-black border-ey-yellow'
                  : 'bg-ey-darkgray hover:bg-ey-black border-ey-yellow/50'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start space-x-2">
                <div className="text-lg mt-0.5">
                  {getAgentIcon(conversation.agent)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate ${
                    currentConversationId === conversation.id ? 'text-ey-black' : 'text-ey-yellow'
                  }`}>
                    {conversation.title}
                  </div>
                  
                  <div className={`flex items-center mt-1 text-xs ${
                    currentConversationId === conversation.id ? 'text-ey-black' : 'text-ey-lightgray'
                  }`}>
                    <Clock className="w-3 h-3 mr-1" />
                    {formatLastActive(conversation.lastActive)}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};
