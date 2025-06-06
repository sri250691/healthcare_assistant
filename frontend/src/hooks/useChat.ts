import { useState, useCallback, useMemo } from 'react';
import { Message, ChatResponse, AgentType, Conversation } from '../types';

const API_BASE = '/api'; // This will be proxied to http://localhost:8001 by Vite

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<AgentType>('general');
  const [conversationId, setConversationId] = useState<string>('');
  const [conversationTitle, setConversationTitle] = useState<string>('');

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true);
    
    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      
      console.log("API Response:", data);
      console.log("Agent received:", data.agent);
      
      // Update conversation ID if new
      if (data.conversation_id && data.conversation_id !== conversationId) {
        setConversationId(data.conversation_id);
      }
      
      // Update current agent
      setCurrentAgent(data.agent);
      console.log("Current agent set to:", data.agent);
      
      // Set conversation title based on first user message if not already set
      if (!conversationTitle && content.length > 0) {
        setConversationTitle(content.slice(0, 30) + (content.length > 30 ? '...' : ''));
      }
      
      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: 'assistant',
        agent: data.agent,
        timestamp: new Date(),
        sources: data.sources,
        metadata: data.metadata,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  const uploadFile = useCallback(async (file: File) => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversation_id', conversationId);

      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      
      // Update conversation ID if new
      if (data.conversation_id && data.conversation_id !== conversationId) {
        setConversationId(data.conversation_id);
      }
      
      // Switch to document chat agent
      setCurrentAgent('doc_chat');
      
      // Add file upload message
      const uploadMessage: Message = {
        id: Date.now().toString(),
        content: `📁 Uploaded: ${file.name}`,
        role: 'user',
        timestamp: new Date(),
      };
      
      // Add analysis response
      const analysisMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: 'assistant',
        agent: data.agent,
        timestamp: new Date(),
        sources: data.sources,
        metadata: data.metadata,
      };
      
      setMessages(prev => [...prev, uploadMessage, analysisMessage]);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error uploading your file. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setConversationId('');
    setConversationTitle('');
    setCurrentAgent('general');
  }, []);

  // Create conversation objects from messages for chat history
  const conversations = useMemo(() => {
    if (messages.length === 0) return [];
    
    // Group messages by conversationId and create conversation objects
    const firstUserMessage = messages.find(m => m.role === 'user')?.content || '';
    const title = conversationTitle || firstUserMessage.slice(0, 30) + (firstUserMessage.length > 30 ? '...' : '');
    
    return [{
      id: conversationId || 'current',
      title: title,
      messages: messages,
      lastActive: new Date(),
      agent: currentAgent,
    }];
  }, [messages, conversationId, currentAgent, conversationTitle]);

  return {
    messages,
    isLoading,
    currentAgent,
    conversations,
    sendMessage,
    uploadFile,
    clearChat,
  };
};
