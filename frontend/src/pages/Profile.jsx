import React, { useRef } from "react";
import dp from "../assets/dp.webp";
import { CiCamera } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { IoMdArrowBack } from "react-icons/io";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { serverUrl } from "../main";
import { setUserData } from "../redux/userSlice";

const Profile = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState(userData.name || "");
  const [frontendImage, setFrontendImage] = useState(userData.image || dp);
  const [backendImage, setBackendImage] = useState(null);
  const [saving, Setsaving] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    try {
      Setsaving(true);
      const formData = new FormData();
      formData.append("name", name);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/v1/user/profile`,
        formData,
        {
          withCredentials: true,
        }
      );
      Setsaving(false);
      dispatch(setUserData(result.data));
      navigate("/");
    } catch (error) {
      Setsaving(false);
      console.log(error);
    }
  };

  let image = useRef();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-100 to-cyan-100 flex flex-col items-center px-4 py-10">
      {/* Back Button */}
      <div
        className="absolute top-5 left-5 text-2xl text-cyan-700 hover:text-cyan-900 cursor-pointer transition"
        onClick={() => navigate("/")}
      >
        <IoMdArrowBack className="w-[40px] h-[40px]" />
      </div>

      {/* Profile Picture */}
      <div className="relative w-40 h-40 mb-6">
        <img
          src={frontendImage}
          alt="Profile"
          className="w-full h-full object-cover rounded-full border-4 border-white shadow-md"
        />
        <div className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow hover:bg-cyan-100 cursor-pointer transition">
          <CiCamera
            size={20}
            className="text-cyan-500"
            onClick={() => image.current.click()}
          />
        </div>
      </div>

      {/* Profile Form */}
      <form
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6"
        onSubmit={handleProfile}
      >
        <input
          type="file"
          accept="image/"
          ref={image}
          hidden
          onChange={handleImage}
        />
        <h2 className="text-2xl font-semibold text-center text-cyan-600 mb-4">
          Edit Profile
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full h-11 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-400 focus:outline-none shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            readOnly
            value={userData.userName}
            className="w-full h-11 px-4 rounded-lg bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            readOnly
            value={userData.email}
            className="w-full h-11 px-4 rounded-lg bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full h-11 bg-cyan-500 text-white font-medium rounded-lg hover:bg-cyan-600 transition duration-200 shadow-md"
          disabled={saving}
        >
          {saving ? "saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
