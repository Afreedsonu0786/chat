import React from "react";
import dp from "../assets/dp.webp";
import { useSelector } from "react-redux";

const SenderMessage = ({ image, message }) => {
  const { userData } = useSelector((state) => state.user);

  return (
    <div className="flex items-start justify-end gap-2 mb-3">
      {/* Message bubble */}
      <div className="bg-cyan-500 text-white px-4 py-2 rounded-2xl rounded-tr-none max-w-xs md:max-w-sm shadow-md">
        {image && (
          <img
            src={image}
            alt="Message"
            className="mb-2 rounded-md max-w-[200px]"
          />
        )}
        {message && <span className="block">{message}</span>}
      </div>

      {/* Avatar */}
      <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden shadow-md border-2 border-white">
        <img
          src={userData?.image || dp}
          alt="Sender"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default SenderMessage;
