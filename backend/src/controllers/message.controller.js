import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import schedule from "node-schedule";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    
    // Get all users except the logged-in user
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    
    // Get the last message and unread count for each user
    const usersWithLastMessage = await Promise.all(
      users.map(async (user) => {
        // Get last message
        const lastMessage = await Message.findOne({
          $or: [
            { senderId: loggedInUserId, receiverId: user._id },
            { senderId: user._id, receiverId: loggedInUserId },
          ],
          isDelivered: true, // Only show delivered messages as last message
        })
          .sort({ createdAt: -1 })
          .select("text image createdAt senderId isRead");

        // Get unread count
        const unreadCount = await Message.countDocuments({
          senderId: user._id,
          receiverId: loggedInUserId,
          isRead: false,
          isDelivered: true, // Only count delivered messages
        });

        return {
          ...user.toObject(),
          lastMessage: lastMessage ? {
            text: lastMessage.text || "",
            image: lastMessage.image || "",
            createdAt: lastMessage.createdAt,
            isFromMe: lastMessage.senderId.toString() === loggedInUserId.toString()
          } : null,
          unreadCount,
          lastMessageAt: lastMessage?.createdAt || new Date(0),
        };
      })
    );

    // Sort users by last message timestamp (most recent first)
    const sortedUsers = usersWithLastMessage.sort(
      (a, b) => b.lastMessageAt - a.lastMessageAt
    );

    res.status(200).json(sortedUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    // Mark messages as read
    await Message.updateMany(
      {
        senderId: userToChatId,
        receiverId: myId,
        isRead: false,
        isDelivered: true, // Only mark delivered messages as read
      },
      { isRead: true }
    );

    // Notify sender that messages were read
    const receiverSocketId = getReceiverSocketId(userToChatId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messagesRead", { senderId: myId });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    // Filter out undelivered scheduled messages for receiver
    const filteredMessages = messages.map(message => {
      if (message.senderId.toString() === myId.toString()) {
        // Show all messages to sender
        return message;
      } else {
        // For receiver, show message with actual delivery time if it's delivered
        if (message.isScheduled && !message.isDelivered) {
          return null;
        }
        return {
          ...message.toObject(),
          createdAt: message.isScheduled ? message.deliveredAt : message.createdAt
        };
      }
    }).filter(Boolean);

    res.status(200).json(filteredMessages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image: imageData, scheduledFor } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl = "";
    if (imageData) {
      const uploadResponse = await cloudinary.uploader.upload(imageData);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl,
      scheduledFor: scheduledFor || null,
      isScheduled: !!scheduledFor,
      isDelivered: !scheduledFor,
      deliveredAt: !scheduledFor ? new Date() : null,
      isRead: false,
    });

    await newMessage.save();

    // If message is scheduled
    if (scheduledFor) {
      const deliveryDate = new Date(scheduledFor);
      schedule.scheduleJob(deliveryDate, async () => {
        try {
          // Mark message as delivered
          await Message.findByIdAndUpdate(newMessage._id, {
            isDelivered: true,
            deliveredAt: new Date(),
          });

          // Emit to receiver if online
          const receiverSocketId = getReceiverSocketId(receiverId);
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
          }
        } catch (error) {
          console.error("Error delivering scheduled message:", error);
        }
      });
    } else {
      // For immediate messages, emit to receiver if online
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
