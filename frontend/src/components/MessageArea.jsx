import React, { useRef, useState, useEffect } from "react";
import { IoMdArrowBack, IoMdSend } from "react-icons/io";
import dp from "../assets/dp.webp";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa6";
import EmojiPicker from "emoji-picker-react";
import SenderMessage from "./SenderMessage";
import RecieverMessage from "./RecieverMessage";
import axios from "axios";
import { serverUrl } from "../main";
import { setMessages } from "../redux/messageSlice";

const MessageArea = () => {
  const { selectedUser, userData, socket } = useSelector((state) => state.user);
  const { messages } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const [emojiPicker, setEmojiPicker] = useState(false);
  const [input, setInput] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backndImage, setBackndImage] = useState(null);
  const image = useRef();
  const scrollRef = useRef(null);
  const messagesEndRef = useRef(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBackndImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim().length === 0 && !backndImage) return;

    try {
      const formData = new FormData();
      formData.append("message", input);
      if (backndImage) {
        formData.append("image", backndImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/v1/message/send/${selectedUser._id}`,
        formData,
        {
          withCredentials: true,
        }
      );

      dispatch(setMessages([...messages, result.data]));
      setInput("");
      setFrontendImage(null);
      setBackndImage(null);
    } catch (error) {
      console.log(error);
    }
  };

  const emojiClick = (emojiData) => {
    setInput((prevInput) => prevInput + emojiData.emoji);
    setEmojiPicker(false);
  };

  useEffect(() => {
    socket.on("newMsg", (msg) => {
      dispatch(setMessages([...messages, msg]));
    });

    return () => {
      socket.off("newMsg");
    };
  }, [messages]);

  // Auto-scroll to bottom on messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="hidden lg:flex flex-col w-full h-screen justify-center items-center text-center bg-white">
        <h1 className="text-gray-700 font-bold text-3xl mb-2">
          Welcome to <span className="text-cyan-500">Chat Friendly</span>
        </h1>
        <p className="text-gray-500 font-medium text-lg max-w-md">
          Select a user from the sidebar to start a conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full lg:w-[70%] h-screen relative bg-white border-l border-gray-200">
      {/* Header */}
      <div className="h-20 bg-cyan-500 px-5 flex items-center gap-4 shadow-md">
        <div
          className="p-2 cursor-pointer hover:bg-cyan-400 rounded-full transition"
          onClick={() => dispatch(setSelectedUser(null))}
        >
          <IoMdArrowBack className="text-white w-6 h-6" />
        </div>
        <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden">
          <img
            src={selectedUser.image || dp}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-white font-semibold text-lg">
          {selectedUser.name || "User"}
        </h1>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-100"
        ref={scrollRef}
        style={{ scrollBehavior: "smooth" }}
      >
        {messages &&
          messages
            .filter(
              (msg) =>
                (msg.sender === userData._id &&
                  msg.receiver === selectedUser._id) ||
                (msg.sender === selectedUser._id &&
                  msg.receiver === userData._id)
            )
            .map((msg) =>
              msg.sender === userData._id ? (
                <SenderMessage
                  key={msg._id}
                  image={msg.image}
                  message={msg.message}
                />
              ) : (
                <RecieverMessage
                  key={msg._id}
                  image={msg.image}
                  message={msg.message}
                />
              )
            )}
        {/* Scroll target */}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker */}
      {emojiPicker && (
        <div className="absolute bottom-28 left-4 z-20">
          <EmojiPicker onEmojiClick={emojiClick} height={350} width={280} />
        </div>
      )}

      {/* Image Preview */}
      {frontendImage && (
        <img
          src={frontendImage}
          alt="Preview"
          className="absolute bottom-28 right-6 w-24 h-auto rounded-md shadow-lg"
        />
      )}

      {/* Input */}
      <div className="w-full px-4 py-3 bg-white border-t border-gray-200">
        <form
          className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-full shadow-md"
          onSubmit={handleSendMessage}
        >
          <RiEmojiStickerLine
            onClick={() => setEmojiPicker((prev) => !prev)}
            className="w-6 h-6 text-gray-600 cursor-pointer hover:text-cyan-500"
          />
          <input
            type="file"
            accept="image/*"
            ref={image}
            hidden
            onChange={handleImage}
          />
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 text-gray-800 bg-transparent placeholder-gray-500 focus:outline-none text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div onClick={() => image.current.click()}>
            <FaImages className="w-5 h-5 text-gray-600 cursor-pointer hover:text-cyan-500" />
          </div>
          {(input.trim().length > 0 || backndImage) && (
            <button type="submit">
              <IoMdSend className="w-6 h-6 text-cyan-500 cursor-pointer hover:scale-110 transition" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default MessageArea;
