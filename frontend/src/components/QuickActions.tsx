import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface QuickAction {
  label: string;
  action: 'switch_agent' | 'quick_message' | 'external_link';
  message?: string;
  url?: string;
  description: string;
}

interface QuickActionsProps {
  onQuickAction: (message: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onQuickAction }) => {
  const quickActions: QuickAction[] = [
    {
      label: '🏥 Medical Help',
      action: 'quick_message',
      message: 'What symptoms require emergency care?',
      description: 'Get urgent medical guidance'
    },
    {
      label: '💊 Medications',
      action: 'quick_message',
      message: 'Can you explain how antibiotics work?',
      description: 'Learn about medication information'
    },
    {
      label: '🩺 Treatments',
      action: 'quick_message',
      message: 'What are common treatments for hypertension?',
      description: 'Information on medical treatments'
    },
    {
      label: '📋 Patient Info',
      action: 'quick_message',
      message: 'What questions should I ask my doctor?',
      description: 'Patient education resources'
    },
    {
      label: '📄 Document Chat',
      action: 'quick_message',
      message: 'I want to upload and analyze a medical document',
      description: 'Upload and analyze medical documents'
    },
    {
      label: '🔍 Medical Resources',
      action: 'external_link',
      url: 'https://medlineplus.gov/',
      description: 'Access trusted medical information'
    }
  ];

  const handleAction = (action: QuickAction) => {
    if (action.action === 'quick_message' && action.message) {
      onQuickAction(action.message);
    } else if (action.action === 'external_link' && action.url) {
      window.open(action.url, '_blank');
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-healthcare-primary mb-3">Quick Prompts</h3>
      
      {quickActions.map((action, index) => (
        <motion.button
          key={index}
          onClick={() => handleAction(action)}
          className="w-full text-left p-3 rounded-lg bg-ey-darkgray hover:bg-ey-darkgray/80 border border-healthcare-primary/40 hover:border-healthcare-primary transition-colors group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-sm font-medium text-healthcare-primary mb-1">
                {action.label}
              </div>
              <div className="text-xs text-ey-lightgray">
                {action.description}
              </div>
            </div>
            
            {action.action === 'external_link' && (
              <ExternalLink className="w-4 h-4 text-healthcare-primary/60 group-hover:text-healthcare-primary" />
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
};
