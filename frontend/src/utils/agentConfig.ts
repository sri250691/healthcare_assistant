import { AgentType } from '../types';

export const agentConfigs = {
  general: {
    name: 'Healthcare Assistant',
    icon: '🏥',
    color: '#0078d4',
    bgColor: 'bg-healthcare-primary bg-opacity-10',
    textColor: 'text-healthcare-primary',
    borderColor: 'border-healthcare-primary',
  },
  hr: {
    name: 'HR Specialist',
    icon: '👥',
    color: '#FFE600',
    bgColor: 'bg-ey-yellow bg-opacity-10',
    textColor: 'text-ey-black',
    borderColor: 'border-ey-yellow',
  },
  it: {
    name: 'IT Support',
    icon: '🔧',
    color: '#2E2E2E',
    bgColor: 'bg-ey-black bg-opacity-10',
    textColor: 'text-ey-black',
    borderColor: 'border-ey-black',
  },
  travel: {
    name: 'Travel Coordinator',
    icon: '✈️',
    color: '#1A1A1A',
    bgColor: 'bg-ey-darkgray bg-opacity-10',
    textColor: 'text-ey-black',
    borderColor: 'border-ey-darkgray',
  },
  doc_chat: {
    name: 'Document Analyst',
    icon: '📄',
    color: '#5c2d91',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
  },
} as const;

export const getAgentConfig = (agent: AgentType) => {
  return agentConfigs[agent] || agentConfigs.general;
};