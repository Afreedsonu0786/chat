import React from "react";
import { IoMdArrowBack } from "react-icons/io";
import dp from "../assets/dp.webp";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";

const MessageArea = () => {
  const { selectedUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <div
      className={`${
        selectedUser ? "flex" : "hidden"
      } lg:flex w-full lg:w-[70%] flex-col h-screen bg-white border-l border-gray-200 transition-all duration-300`}
    >
      {/* Header - only show if selectedUser exists */}
      {selectedUser && (
        <div className="w-full h-24 bg-cyan-400 rounded-b-3xl shadow-md px-5 flex items-center gap-4">
          <div
            className="p-2 cursor-pointer hover:bg-cyan-300 rounded-full transition"
            onClick={() => dispatch(setSelectedUser(null))}
          >
            <IoMdArrowBack className="text-white w-7 h-7" />
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden shadow-md">
            <img
              src={selectedUser.image || dp}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-white font-semibold text-xl truncate">
            {selectedUser.name || "User"}
          </h1>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 flex flex-col justify-center items-center text-gray-400 px-4 text-center">
        {selectedUser ? (
          <p className="text-lg">
            Start chatting with{" "}
            <span className="font-semibold text-gray-600">
              {selectedUser.name}
            </span>
            .
          </p>
        ) : (
          <div>
            <h1 className="text-gray-700 font-bold text-3xl mb-2">
              Welcome to <span className="text-cyan-500">Chat Friendly</span>
            </h1>
            <p className="text-gray-500 font-medium text-lg max-w-md">
              Select a user from the sidebar to start a conversation and stay
              connected.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageArea;
