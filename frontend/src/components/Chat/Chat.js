import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import ChannelList from './ChannelList';
import ChannelView from './ChannelView';
import OnlineUsers from './OnlineUsers';
import axios from 'axios';

import { API_URL } from '../../config';

function Chat() {
  const { user, logout } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateChannel, setShowCreateChannel] = useState(false);

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/channels/my-channels`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChannels(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch channels:', error);
      setLoading(false);
    }
  };

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
  };

  const handleChannelCreated = (newChannel) => {
    setChannels([...channels, newChannel]);
    setShowCreateChannel(false);
  };

  const handleJoinChannel = async (channelId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/channels/${channelId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchChannels();
    } catch (error) {
      console.error('Failed to join channel:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-lg text-slate-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900">
      <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col border-r border-slate-700/50">
        <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-indigo-600/20 to-purple-600/20">
          <h1 className="text-xl font-bold gradient-text">Team Chat</h1>
          <p className="text-sm text-slate-400 mt-1">Welcome, {user?.username}</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ChannelList
            channels={channels}
            selectedChannel={selectedChannel}
            onSelectChannel={handleChannelSelect}
            onJoinChannel={handleJoinChannel}
            showCreateChannel={showCreateChannel}
            setShowCreateChannel={setShowCreateChannel}
            onChannelCreated={handleChannelCreated}
            onChannelsUpdated={fetchChannels}
          />
        </div>

        <div className="p-4 border-t border-slate-700/50">
          <OnlineUsers onlineUsers={onlineUsers} currentUserId={user?.id} />
        </div>

        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={logout}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2 px-4 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-red-500/30"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChannel ? (
          <ChannelView
            channel={selectedChannel}
            socket={socket}
            currentUser={user}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-900">
            <div className="text-center text-slate-400">
              <div className="mb-4">
                <svg className="w-24 h-24 mx-auto text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-slate-300">Select a Channel</h2>
              <p>Choose a channel from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;

