import React from "react";
import dp from "../assets/dp.webp";

const SenderMessage = ({ image, message }) => {
  return (
    <div
      className="w-fit max-w-125 bg-cyan-400 py-3 px-3 text-white font-medium  rounded-tr-none rounded-2xl relative right-0 mt-auto ml-auto
    shadow-sm shadow-gray-400 mb-2 gap-2.5 flex flex-col
    "
    >
      {image && <img src={image} alt="" className="w-[150px] rounded-lg" />}
      {message && <span>{message}</span>}
    </div>
  );
};

export default SenderMessage;
