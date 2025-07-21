import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Search, ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useMessageStore } from '../store/messageStore';
import { useAuthStore } from '../store/authStore';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { user } = useAuthStore();
  const { 
    conversations, 
    messages, 
    currentConversation,
    fetchConversations, 
    fetchMessages,
    sendMessage,
    markAsRead,
    isLoading 
  } = useMessageStore();
  
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileConversationOpen, setIsMobileConversationOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);
  
  // Fetch messages when conversation is selected
  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
      markAsRead(conversationId);
      setIsMobileConversationOpen(true);
    }
  }, [conversationId, fetchMessages, markAsRead]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conversation => {
    const participantName = conversation.participantNames.find(
      name => name !== user?.name
    ) || '';
    
    return (
      participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (conversation.serviceTitle && 
       conversation.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
  // Handle sending a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !currentConversation || !user) return;
    
    const receiverId = currentConversation.participantIds.find(id => id !== user.id) || '';
    
    try {
      await sendMessage(currentConversation.id, newMessage, receiverId);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  // Format timestamp
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date for conversation grouping
  const formatConversationDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Back button for mobile
  const handleBackToList = () => {
    setIsMobileConversationOpen(false);
    navigate('/messages');
  };
  
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)]">
        <div className="flex h-full overflow-hidden bg-primary-600 rounded-lg border border-primary-500">
          {/* Conversations List */}
          <div className={`w-full md:w-1/3 border-r border-primary-500 flex flex-col ${
            isMobileConversationOpen ? 'hidden md:flex' : 'flex'
          }`}>
            <div className="p-4 border-b border-primary-500">
              <h1 className="text-xl font-bold text-secondary-50 mb-4">Messages</h1>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 bg-primary-700 border border-primary-500 rounded-md text-secondary-100 placeholder-secondary-300/50 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-300 w-5 h-5" />
              </div>
            </div>
            
            {isLoading && conversations.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredConversations.length > 0 ? (
              <div className="flex-grow overflow-y-auto">
                {filteredConversations.map((conversation) => {
                  const otherParticipantName = conversation.participantNames.find(
                    name => name !== user?.name
                  ) || '';
                  const otherParticipantAvatar = conversation.participantAvatars[
                    conversation.participantNames.indexOf(otherParticipantName)
                  ];
                  const isActive = conversation.id === conversationId;
                  
                  return (
                    <div
                      key={conversation.id}
                      className={`p-4 border-b border-primary-500 hover:bg-primary-500 cursor-pointer transition-colors ${
                        isActive ? 'bg-primary-500' : ''
                      }`}
                      onClick={() => navigate(`/messages/${conversation.id}`)}
                    >
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <img
                              src={otherParticipantAvatar || 'https://via.placeholder.com/150'}
                              alt={otherParticipantName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {conversation.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary-500 rounded-full flex items-center justify-center text-xs font-medium text-primary-800">
                              {conversation.unreadCount}
                            </div>
                          )}
                        </div>
                        <div className="ml-3 flex-grow min-w-0">
                          <div className="flex justify-between items-center">
                            <p className="font-medium text-secondary-50 truncate">
                              {otherParticipantName}
                            </p>
                            {conversation.lastMessageDate && (
                              <span className="text-xs text-secondary-300">
                                {formatConversationDate(conversation.lastMessageDate)}
                              </span>
                            )}
                          </div>
                          {conversation.lastMessage && (
                            <p className="text-sm text-secondary-300 truncate">
                              {conversation.lastMessage}
                            </p>
                          )}
                          {conversation.serviceTitle && (
                            <p className="text-xs text-secondary-400 truncate mt-1">
                              Re: {conversation.serviceTitle}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <p className="text-secondary-200 mb-4">
                  {searchTerm
                    ? "No conversations matching your search"
                    : "You don't have any messages yet"}
                </p>
                <Button 
                  variant="primary"
                  onClick={() => navigate('/explore')}
                >
                  Explore Services
                </Button>
              </div>
            )}
          </div>
          
          {/* Conversation */}
          <div className={`w-full md:w-2/3 flex flex-col ${
            !isMobileConversationOpen && !conversationId ? 'hidden md:flex' : 'flex'
          }`}>
            {currentConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b border-primary-500 flex items-center">
                  <button
                    className="md:hidden mr-2 text-secondary-300 hover:text-secondary-100"
                    onClick={handleBackToList}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    {currentConversation.participantAvatars.find(
                      (_, i) => currentConversation.participantIds[i] !== user?.id
                    ) ? (
                      <img
                        src={currentConversation.participantAvatars.find(
                          (_, i) => currentConversation.participantIds[i] !== user?.id
                        )}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-500" />
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <h2 className="text-lg font-medium text-secondary-50">
                      {currentConversation.participantNames.find(
                        name => name !== user?.name
                      )}
                    </h2>
                    
                    {currentConversation.serviceTitle && (
                      <div className="flex items-center text-sm text-secondary-300">
                        <span className="truncate">Re: {currentConversation.serviceTitle}</span>
                        {currentConversation.serviceId && (
                          <a
                            href={`/services/${currentConversation.serviceId}`}
                            className="ml-1 text-secondary-500 hover:text-secondary-400"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/services/${currentConversation.serviceId}`);
                            }}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  {messages.length > 0 ? (
                    messages.map((message) => {
                      const isSentByUser = message.senderId === user?.id;
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isSentByUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[75%] ${isSentByUser ? 'order-2' : 'order-1'}`}>
                            <div
                              className={`rounded-lg p-3 ${
                                isSentByUser
                                  ? 'bg-secondary-500 text-primary-800'
                                  : 'bg-primary-500 text-secondary-100'
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{message.content}</p>
                            </div>
                            <p className={`text-xs text-secondary-400 mt-1 ${
                              isSentByUser ? 'text-right' : 'text-left'
                            }`}>
                              {formatMessageTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-secondary-300">
                        Start a conversation with {currentConversation.participantNames.find(
                          name => name !== user?.name
                        )}
                      </p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message Input */}
                <div className="p-4 border-t border-primary-500">
                  <form onSubmit={handleSendMessage} className="flex items-center">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-grow mr-2 py-2 px-4 bg-primary-700 border border-primary-500 rounded-md text-secondary-100 placeholder-secondary-300/50 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={!newMessage.trim()}
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <p className="text-xl text-secondary-200 mb-2">Select a conversation</p>
                <p className="text-secondary-300">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;