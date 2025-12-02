import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { API_URL } from '../../config';

function ChannelView({ channel, socket, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [channelDetails, setChannelDetails] = useState(null);
  const [showMembers, setShowMembers] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (channel && socket) {
      socket.emit('join-channel', channel.id);
      loadMessages();
      fetchChannelDetails();

      socket.on('new-message', (message) => {
        if (message.channel_id === channel.id || !message.channel_id) {
          setMessages((prev) => [...prev, message]);
        }
      });

      return () => {
        socket.emit('leave-channel', channel.id);
        socket.off('new-message');
      };
    }
  }, [channel?.id, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async (pageNum = 1) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/messages/channel/${channel.id}?page=${pageNum}&limit=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (pageNum === 1) {
        setMessages(response.data.messages);
      } else {
        setMessages((prev) => [...response.data.messages, ...prev]);
      }

      setHasMore(response.data.pagination.hasMore);
      setPage(pageNum);
      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchChannelDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/channels/${channel.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChannelDetails(response.data);
    } catch (error) {
      console.error('Failed to fetch channel details:', error);
    }
  };

  const handleLeaveChannel = async () => {
    if (!window.confirm('Are you sure you want to leave this channel?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/channels/${channel.id}/leave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.reload();
    } catch (error) {
      console.error('Failed to leave channel:', error);
      alert(error.response?.data?.error || 'Failed to leave channel');
    }
  };

  const loadMoreMessages = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      loadMessages(page + 1);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit('send-message', {
      channelId: channel.id,
      content: newMessage
    });

    setNewMessage('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;

    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-900">
      <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-2xl font-bold gradient-text"># {channel.name}</h2>
            {channel.description && (
              <p className="text-sm text-slate-400 mt-1">{channel.description}</p>
            )}
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => setShowMembers(!showMembers)}
                className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                {channelDetails?.members?.length || channel.member_count || 0} members
                <span className="ml-1">{showMembers ? '▲' : '▼'}</span>
              </button>
            </div>
          </div>
          <button
            onClick={handleLeaveChannel}
            className="ml-4 px-3 py-1.5 text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50 rounded-lg transition-all"
          >
            Leave Channel
          </button>
        </div>

        {showMembers && channelDetails?.members && (
          <div className="mt-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
            <h3 className="text-sm font-semibold text-slate-300 mb-2">Channel Members</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {channelDetails.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 p-2 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-purple-500/50 transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-lg">
                    {member.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-200 truncate">
                      {member.username}
                      {member.id === currentUser?.id && (
                        <span className="ml-1 text-xs text-purple-400">(you)</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 truncate">{member.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900"
        onScroll={(e) => {
          if (e.target.scrollTop === 0 && hasMore) {
            loadMoreMessages();
          }
        }}
      >
        {hasMore && (
          <div className="text-center">
            <button
              onClick={loadMoreMessages}
              disabled={loadingMore}
              className="text-purple-400 hover:text-purple-300 text-sm disabled:opacity-50 transition-colors"
            >
              {loadingMore ? 'Loading...' : 'Load older messages'}
            </button>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.user_id === currentUser?.id ? 'justify-end' : 'justify-start'
              }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-lg ${message.user_id === currentUser?.id
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                : 'bg-slate-800 text-slate-100 border border-slate-700'
                }`}
            >
              {message.user_id !== currentUser?.id && (
                <div className="font-semibold text-sm mb-1 text-purple-300">
                  {message.username}
                </div>
              )}
              <div className="text-sm">{message.content}</div>
              <div
                className={`text-xs mt-1 ${message.user_id === currentUser?.id
                  ? 'text-indigo-200'
                  : 'text-slate-500'
                  }`}
              >
                {formatTime(message.created_at)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-slate-700/50 bg-gradient-to-r from-slate-900 to-slate-800">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-purple-500/30"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChannelView;

