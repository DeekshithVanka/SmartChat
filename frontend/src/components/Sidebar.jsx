import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-80 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3 relative
              hover:bg-base-200 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-200" : ""}
            `}
          >
            {/* User Avatar */}
            <div className="relative">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="size-12 rounded-full object-cover"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-success rounded-full border-2 border-base-100" />
              )}
            </div>

            {/* User Info - Only visible on larger screens */}
            <div className="hidden lg:flex flex-col items-start flex-1 min-w-0">
              <span className="font-medium">{user.fullName}</span>
              {user.lastMessage && (
                <div className="flex items-center gap-1 w-full">
                  <p className="text-sm text-gray-500 truncate flex-1">
                    {user.lastMessage.isFromMe && "You: "}
                    {user.lastMessage.image ? "Sent an image" : user.lastMessage.text}
                  </p>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {formatDistanceToNow(new Date(user.lastMessage.createdAt), { addSuffix: true })}
                  </span>
                </div>
              )}
            </div>

            {/* Unread Count Badge */}
            {user.unreadCount > 0 && selectedUser?._id !== user._id && (
              <div className="absolute top-2 right-2">
                <span className="badge badge-sm badge-primary">{user.unreadCount}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
