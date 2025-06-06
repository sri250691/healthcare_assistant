import React from 'react';
import { motion } from 'framer-motion';
import { AgentType } from '../types';
import { getAgentConfig } from '../utils/agentConfig';

interface AgentIndicatorProps {
  currentAgent: AgentType;
  isLoading?: boolean;
  metadata?: {
    invoked_agent_reason?: string;
  };
}

export const AgentIndicator = ({ 
  currentAgent, 
  isLoading = false,
  metadata = {} 
}: AgentIndicatorProps) => {
  const config = getAgentConfig(currentAgent);
  
  console.log("AgentIndicator rendering with agent:", currentAgent);
  
  return (
    <motion.div
      key={currentAgent}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`flex items-center px-4 py-2 rounded-full ${config.bgColor} ${config.borderColor} border`}
    >
      <motion.div
        animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 2, repeat: isLoading ? Infinity : 0, ease: "linear" }}
        className="text-2xl mr-3"
      >
        {config.icon}
      </motion.div>
      
      <div>
        <div className={`font-medium ${config.textColor}`}>
          {config.name}
        </div>
        <div className="text-xs text-healthcare-primary">
          {isLoading ? 'Thinking...' : 'Active'} 
          <span className="ml-1 font-semibold">[{currentAgent}]</span>
        </div>
        {metadata?.invoked_agent_reason && !isLoading && (
          <div className="text-xs text-ey-lightgray mt-1 max-w-md">
            {metadata.invoked_agent_reason}
          </div>
        )}
      </div>
      
      {isLoading && (
        <motion.div
          className="ml-3 flex space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className={`w-2 h-2 rounded-full ${
                config.color === '#FFE600' ? 'bg-ey-yellow' : 
                config.color === '#2E2E2E' ? 'bg-ey-black' :
                config.color === '#1A1A1A' ? 'bg-ey-darkgray' :
                config.color === '#5c2d91' ? 'bg-purple-500' : 'bg-blue-500'
              }`}
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};
