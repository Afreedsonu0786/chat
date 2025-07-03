import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.webp";
import { IoMdSearch, IoMdLogOut } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { serverUrl } from "../main";
import {
  setOtherUsers,
  setSelectedUser,
  setUserData,
} from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { userData, otherUser, selectedUser } = useSelector(
    (state) => state.user
  );
  const [search, setSearch] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/v1/logout`, {
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
    <div
      className={`${
        selectedUser ? "hidden" : "flex"
      } lg:flex w-full lg:w-[30%] h-screen bg-gradient-to-b from-cyan-400 to-cyan-200 shadow-xl flex-col relative transition-all duration-300`}
    >
      {/* Logout */}
      <div
        className="absolute bottom-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-red-100 transition"
        onClick={handleLogOut}
      >
        <IoMdLogOut className="text-red-500 text-2xl" />
      </div>

      {/* Header */}
      <div className="w-full h-[270px] rounded-b-[60px] bg-cyan-500 flex flex-col gap-6 justify-center px-6 py-6 shadow-md">
        <h1 className="text-white font-extrabold text-3xl tracking-wide">
          Chat Friendly
        </h1>

        <div className="flex justify-between items-center">
          <h2 className="text-white font-semibold text-2xl">
            Hi, {userData?.name || "user"}
          </h2>
          <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden shadow-lg">
            <img
              src={userData?.image || dp}
              alt="Profile"
              onClick={() => navigate("/profile")}
              className="w-full h-full object-cover cursor-pointer"
            />
          </div>
        </div>

        {/* Search or mini avatars */}
        <div className="flex items-center gap-3 relative mt-3">
          {search ? (
            <form className="flex-grow bg-white rounded-full shadow px-4 py-2 flex items-center gap-3">
              <IoMdSearch className="text-cyan-600 text-xl" />
              <input
                className="w-full text-base outline-none placeholder:text-gray-400"
                type="text"
                placeholder="Search Users..."
              />
              <RxCross2
                className="text-gray-500 text-xl cursor-pointer hover:text-red-500"
                onClick={() => setSearch(false)}
              />
            </form>
          ) : (
            <>
              {otherUser?.map((user, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-md mt-1"
                >
                  <img
                    src={user.image || dp}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <div
                className="ml-auto w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-cyan-100 transition"
                onClick={() => setSearch(true)}
              >
                <IoMdSearch className="text-cyan-600 text-xl" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Other Users */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {otherUser?.map((user, i) => (
          <div
            key={i}
            className="flex items-center gap-4 bg-white rounded-full p-3 pr-5 shadow hover:bg-cyan-50 transition cursor-pointer"
            onClick={() => dispatch(setSelectedUser(user))}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-400 shadow">
              <img
                src={user.image || dp}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-gray-700 font-semibold text-lg truncate">
              {user.name || user.username}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
