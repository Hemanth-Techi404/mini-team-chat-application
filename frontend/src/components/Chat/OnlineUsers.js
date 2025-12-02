import React from 'react';

function OnlineUsers({ onlineUsers, currentUserId }) {
  // Filter out current user and get unique users
  const otherUsers = onlineUsers.filter(
    (user, index, self) =>
      user.userId !== currentUserId &&
      index === self.findIndex((u) => u.userId === user.userId)
  );

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-400 mb-2">Online Users</h3>
      <div className="space-y-1">
        <div className="flex items-center text-sm text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          You (online)
        </div>
        {otherUsers.length > 0 ? (
          otherUsers.map((user) => (
            <div key={user.userId} className="flex items-center text-sm text-gray-300">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              {user.username || `User ${user.userId}`}
            </div>
          ))
        ) : (
          <div className="text-xs text-gray-500">No other users online</div>
        )}
      </div>
    </div>
  );
}

export default OnlineUsers;

