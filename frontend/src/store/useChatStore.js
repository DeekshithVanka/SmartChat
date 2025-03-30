import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
      // Refresh user list to update unread counts
      await get().getUsers();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages, getUsers } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
      // Refresh user list to update order and last message
      await getUsers();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // Listen for new messages
    socket.on("newMessage", async (message) => {
      const { messages, selectedUser, getUsers } = get();
      
      // Update messages if they're from the selected user
      if (message.senderId === selectedUser._id) {
        set({ messages: [...messages, message] });
      }
      
      // Refresh user list to update order and unread count
      await getUsers();
    });

    // Listen for read receipts
    socket.on("messagesRead", async ({ senderId }) => {
      const { messages, selectedUser, getUsers } = get();
      
      // Update read status if messages are from current chat
      if (selectedUser?._id === senderId) {
        const updatedMessages = messages.map(msg => ({
          ...msg,
          isRead: true
        }));
        set({ messages: updatedMessages });
      }
      
      // Refresh user list to update unread counts
      await getUsers();
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
      socket.off("messagesRead");
    }
  },

  setSelectedUser: async (selectedUser) => {
    set({ selectedUser });
    if (selectedUser) {
      // Get messages and update read status when selecting a user
      await get().getMessages(selectedUser._id);
    }
  },
}));
