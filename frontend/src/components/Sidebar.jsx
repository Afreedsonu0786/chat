import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.webp";
import { IoMdSearch, IoMdLogOut } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { serverUrl } from "../main";
import {
  setOtherUsers,
  setSearchData,
  setSelectedUser,
  setUserData,
} from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { userData, otherUser, selectedUser, onlineUsers, searchData } =
    useSelector((state) => state.user);
  const [search, setSearch] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [input, setInput] = useState("");

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/v1/logout`, { withCredentials: true });
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/v1/user/search?query=${input}`,
        { withCredentials: true }
      );
      dispatch(setSearchData(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (input.trim()) handleSearch();
  }, [input]);

  return (
    <div
      className={`${
        selectedUser ? "hidden" : "flex"
      } w-full lg:flex lg:w-[30%] h-screen bg-gradient-to-b from-cyan-400 to-cyan-200 shadow-xl flex-col transition-all duration-300`}
    >
      {/* Logout Button */}
      <div
        className="absolute bottom-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-red-100 transition"
        onClick={handleLogOut}
      >
        <IoMdLogOut className="text-red-500 text-2xl" />
      </div>

      {/* Header */}
      <div className="w-full h-[270px] rounded-b-[60px] bg-cyan-500 flex flex-col gap-6 justify-center px-6 py-6 shadow-md">
        <h1 className="text-white font-extrabold text-2xl lg:text-3xl">
          Chat Friendly
        </h1>

        <div className="flex justify-between items-center">
          <h2 className="text-white font-semibold text-xl lg:text-2xl">
            Hi, {userData?.name || "user"}
          </h2>
          <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full border-4 border-white overflow-hidden shadow-lg">
            <img
              src={userData?.image || dp}
              alt="Profile"
              onClick={() => navigate("/profile")}
              className="w-full h-full object-cover cursor-pointer"
            />
          </div>
        </div>

        {/* Search or Online Avatars */}
        <div className="flex items-center gap-3 relative mt-3">
          {search ? (
            <form className="w-full bg-white rounded-full shadow px-4 py-2 flex items-center gap-3">
              <IoMdSearch className="text-cyan-600 text-xl" />
              <input
                className="flex-grow text-base outline-none placeholder:text-gray-400"
                type="text"
                placeholder="Search Users..."
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
              <RxCross2
                className="text-gray-500 text-xl cursor-pointer hover:text-red-500"
                onClick={() => {
                  setSearch(false);
                  setInput("");
                  dispatch(setSearchData(null));
                }}
              />
            </form>
          ) : (
            <>
              <div className="flex gap-2 overflow-x-auto max-w-full pr-2">
                {otherUser?.slice(0, 8).map(
                  (user, i) =>
                    onlineUsers?.includes(user._id) && (
                      <div
                        key={i}
                        className="relative rounded-full cursor-pointer"
                        onClick={() => dispatch(setSelectedUser(user))}
                      >
                        <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden shadow-md shrink-0">
                          <img
                            src={user.image || dp}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="w-3 h-3 bg-green-400 rounded-full absolute bottom-1.5 right-[-1px] shadow-md"></span>
                      </div>
                    )
                )}
              </div>
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

      {/* User List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin scrollbar-thumb-cyan-300">
        {(search ? searchData : otherUser)?.map((user, i) => (
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
