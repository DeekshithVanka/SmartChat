import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Clock } from "lucide-react";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
  const [scheduledFor, setScheduledFor] = useState(null);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendButtonTouchStart = (e) => {
    e.preventDefault(); // Prevent default touch behavior
    const timer = setTimeout(() => {
      setShowSchedulePicker(true);
      toast.success("Schedule your message");
    }, 500);
    setLongPressTimer(timer);
  };

  const handleSendButtonTouchEnd = (e) => {
    e.preventDefault(); // Prevent default touch behavior
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleScheduleChange = (date) => {
    if (date && date > new Date()) {
      setScheduledFor(date);
      toast.success("Message scheduled!");
      setShowSchedulePicker(false);
    } else {
      toast.error("Please select a future date and time");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        scheduledFor: scheduledFor?.toISOString(),
      });

      // Show success toast for scheduled messages
      if (scheduledFor) {
        toast.success(`Message scheduled for ${scheduledFor.toLocaleString()}`);
      }

      // Clear form
      setText("");
      setImagePreview(null);
      setScheduledFor(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  // Function to close the date picker
  const handleClickOutside = (e) => {
    if (showSchedulePicker) {
      setShowSchedulePicker(false);
    }
  };

  return (
    <div className="p-4 w-full relative">
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="file"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-full hover:bg-gray-700"
        >
          <Image className="w-6 h-6" />
        </button>

        <button
          type="submit"
          onTouchStart={handleSendButtonTouchStart}
          onTouchEnd={handleSendButtonTouchEnd}
          onMouseDown={handleSendButtonTouchStart}
          onMouseUp={handleSendButtonTouchEnd}
          onMouseLeave={handleSendButtonTouchEnd}
          className="p-2 rounded-full hover:bg-gray-700 relative"
        >
          {scheduledFor ? (
            <Clock className="w-6 h-6 text-blue-500" />
          ) : (
            <Send className="w-6 h-6" />
          )}
        </button>
      </form>

      {showSchedulePicker && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleClickOutside}
        >
          <div 
            className="bg-gray-800 p-4 rounded-lg shadow-lg max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Schedule Message</h3>
              <button 
                onClick={() => setShowSchedulePicker(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <DatePicker
              selected={scheduledFor || new Date()}
              onChange={handleScheduleChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              minDate={new Date()}
              inline
              className="w-full bg-gray-800 text-white"
              calendarClassName="!bg-gray-800 !text-white !border-gray-700"
              dayClassName={date => 
                "!text-white hover:!bg-blue-500 hover:!text-white"
              }
              monthClassName={() => "!text-white"}
              weekDayClassName={() => "!text-white"}
              timeClassName={() => "!text-white !bg-gray-700 hover:!bg-gray-600"}
            />
          </div>
        </div>
      )}

      {imagePreview && (
        <div className="relative w-32 h-32 mt-2">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            onClick={removeImage}
            className="absolute top-1 right-1 p-1 bg-gray-900 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
