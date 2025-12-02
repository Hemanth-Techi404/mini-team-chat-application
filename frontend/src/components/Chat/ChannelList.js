import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { API_URL } from '../../config';

function ChannelList({
  channels,
  selectedChannel,
  onSelectChannel,
  onJoinChannel,
  showCreateChannel,
  setShowCreateChannel,
  onChannelCreated,
  onChannelsUpdated
}) {
  const [allChannels, setAllChannels] = useState([]);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDesc, setNewChannelDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllChannels();
  }, []);

  const fetchAllChannels = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/channels`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllChannels(response.data);
    } catch (error) {
      console.error('Failed to fetch all channels:', error);
    }
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/channels`,
        {
          name: newChannelName,
          description: newChannelDesc
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onChannelCreated(response.data);
      setNewChannelName('');
      setNewChannelDesc('');
      onChannelsUpdated();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create channel');
    } finally {
      setLoading(false);
    }
  };

  const myChannelIds = new Set(channels.map((c) => c.id));

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-200">Channels</h2>
        <button
          onClick={() => setShowCreateChannel(!showCreateChannel)}
          className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
        >
          {showCreateChannel ? 'Cancel' : '+ New'}
        </button>
      </div>

      {showCreateChannel && (
        <form onSubmit={handleCreateChannel} className="mb-4 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
          {error && (
            <div className="text-red-400 text-sm mb-2 bg-red-500/10 p-2 rounded">{error}</div>
          )}
          <input
            type="text"
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
            placeholder="Channel name"
            required
            className="w-full px-3 py-2 mb-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-slate-500"
          />
          <input
            type="text"
            value={newChannelDesc}
            onChange={(e) => setNewChannelDesc(e.target.value)}
            placeholder="Description (optional)"
            className="w-full px-3 py-2 mb-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 px-3 rounded-lg text-sm disabled:opacity-50 font-medium transition-all shadow-lg hover:shadow-purple-500/30"
          >
            Create
          </button>
        </form>
      )}

      <div className="space-y-1">
        <div className="text-xs text-slate-500 uppercase mb-2 font-semibold tracking-wider">My Channels</div>
        {channels.map((channel) => (
          <div
            key={channel.id}
            onClick={() => onSelectChannel(channel)}
            className={`p-2 rounded-lg cursor-pointer transition-all ${selectedChannel?.id === channel.id
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/30'
              : 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
              }`}
          >
            <div className="font-medium"># {channel.name}</div>
            <div className="text-xs opacity-75">
              {channel.member_count} members
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-1">
        <div className="text-xs text-slate-500 uppercase mb-2 font-semibold tracking-wider">Other Channels</div>
        {allChannels
          .filter((channel) => !myChannelIds.has(channel.id))
          .map((channel) => (
            <div
              key={channel.id}
              className="p-2 rounded-lg hover:bg-slate-700/30 text-slate-300 transition-all"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium"># {channel.name}</div>
                  <div className="text-xs opacity-75">
                    {channel.member_count} members
                  </div>
                </div>
                <button
                  onClick={() => onJoinChannel(channel.id)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs px-3 py-1 rounded-lg font-medium transition-all shadow-md hover:shadow-purple-500/30"
                >
                  Join
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ChannelList;

