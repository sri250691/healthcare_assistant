export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  agent?: AgentType;
  timestamp: Date;
  sources?: Source[];
  metadata?: Record<string, any>;
}

export interface Source {
  title: string;
  type: string;
  url?: string;
  confidence?: number;
  lastModified?: string;
}

export interface ChatResponse {
  message: string;
  agent: AgentType;
  conversation_id: string;
  sources: Source[];
  suggested_actions: string[];
  metadata: Record<string, any>;
}

export interface QuickAction {
  label: string;
  action: 'switch_agent' | 'quick_message' | 'external_link';
  agent?: AgentType;
  message?: string;
  url?: string;
  description: string;
}

export interface AgentConfig {
  type: AgentType;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export type AgentType = 'general' | 'hr' | 'it' | 'travel' | 'doc_chat';

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastActive: Date;
  agent: AgentType;
}
