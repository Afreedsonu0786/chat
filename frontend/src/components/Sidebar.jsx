import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.webp";
import { IoMdSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { IoMdLogOut } from "react-icons/io";
import axios from "axios";
import { serverUrl } from "../main";
import { setOtherUsers, setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  let { userData, otherUser } = useSelector((state) => state.user);
  const [search, setSearch] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/v1/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="lg:w-[30%] w-full h-full bg-gradient-to-b from-cyan-400 to-cyan-200 shadow-xl">
      <div
        className="absolute right-6 w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-gray-100 transition bottom-5 left-5"
        onClick={handleLogOut}
      >
        <IoMdLogOut className="text-gray-700 text-2xl" />
      </div>
      <div className="w-full h-[300px] rounded-b-[80px] bg-cyan-500 flex flex-col gap-6 justify-center px-8 py-6 relative">
        <h1 className="text-white font-extrabold text-3xl tracking-wide">
          Chat Friendly
        </h1>
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-white font-semibold text-2xl">
            Hi, {userData.name || "user"}
          </h1>
          <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden shadow-xl">
            <img
              onClick={() => navigate("/profile")}
              src={userData.image || dp}
              alt="Profile"
              className="w-full h-full object-cover cursor-pointer"
            />
          </div>
        </div>
        <div className="w-full flex items-center gap-5">
          {!search && (
            <div
              className="absolute right-6 bottom-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-gray-100 transition"
              onClick={() => setSearch(true)}
            >
              <IoMdSearch className="text-cyan-600 text-2xl" />
            </div>
          )}
          {search && (
            <form className="w-full bg-white rounded-full shadow-xl mt-5 px-4 py-2 flex items-center gap-4">
              <IoMdSearch className="text-cyan-600 text-2xl cursor-pointer" />
              <input
                className="flex-grow text-lg px-2 py-1 outline-none"
                type="text"
                placeholder="Search Users..."
              />
              <RxCross2
                className="text-gray-500 text-2xl cursor-pointer hover:text-red-500"
                onClick={() => setSearch(false)}
              />
            </form>
          )}
          {otherUser?.map((user) => (
            <div className="w-12 h-12 rounded-full border-4 border-white overflow-hidden shadow-xl mt-5">
              <img
                src={user.image || dp}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
