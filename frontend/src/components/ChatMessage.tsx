import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { getAgentConfig } from '../utils/agentConfig';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const agentConfig = message.agent ? getAgentConfig(message.agent) : null;
  
  console.log("Rendering message with agent:", message.agent);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
        {!isUser && agentConfig && (
          <div className="flex items-center mb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mr-2 ${agentConfig.bgColor} ${agentConfig.borderColor} border`}
            >
              {agentConfig.icon}
            </motion.div>
            <span className={`text-sm font-medium ${agentConfig.textColor}`}>
              {agentConfig.name}
            </span>
          </div>
        )}
        
        <div
          className={`p-4 rounded-lg text-white ${
            isUser
              ? 'bg-healthcare-primary ml-4'
              : agentConfig
              ? `${agentConfig.bgColor} border ${agentConfig.borderColor} mr-4`
              : 'bg-gray-700 mr-4'
          }`}
        >
          {message.metadata?.azure_openai_error && (
            <div className="bg-yellow-800 border-l-4 border-yellow-500 text-white p-2 mb-3 rounded">
              <p className="text-xs">⚠️ EYQ Incubator connection error detected</p>
            </div>
          )}
          <div className="prose prose-sm prose-invert max-w-none">
            {isUser ? (
              <p className="m-0 text-white">{message.content}</p>
            ) : (
              <ReactMarkdown className="text-white">{message.content}</ReactMarkdown>
            )}
          </div>
          
          {message.sources && message.sources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white border-opacity-20">
              <p className="text-xs font-medium mb-2 text-white">Sources:</p>
              <div className="space-y-1">
                {message.sources.map((source, index) => (
                  <div key={index} className="text-xs text-white opacity-80">
                    📎 {source.title} ({source.type})
                    {source.confidence && (
                      <span className="ml-1">
                        • {Math.round(source.confidence * 100)}% confidence
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className={`text-xs text-white opacity-70 mt-1 ${isUser ? 'text-right mr-4' : 'ml-4'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {message.metadata?.azure_openai && !isUser && (
            <span className="ml-2 text-xs font-medium text-white">via EYQ Incubator</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
