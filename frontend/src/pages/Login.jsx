import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/v1/login`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      navigate("/");
      setEmail("");
      setPass("");
      setLoading(false);
      setError("");
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error.response.data);
    }
  };
  return (
    <div className="w-full h-[100vh] bg-slate-200 flex items-center justify-center flex-wrap">
      <div className="w-full max-w-[500px] h-[600px] bg-white rounded-lg shadow-gray-300 shadow-lg flex flex-col gap-[30px]">
        <div className="w-full h-[200px] bg-cyan-300 rounded-b-[30%] shadow-gray-300 shadow-lg flex items-center justify-center">
          <h1 className="text-gray-500 font-bold text-[30px] ">
            Login to <span className="text-white">Chat</span>
            <span className="text-gray-600"> Friendly</span>
          </h1>
        </div>
        <form
          className="w-full flex flex-col gap-8 items-center"
          onSubmit={handleLogin}
        >
          <input
            type="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="w-[60%] h-[40px] outline-none border-2 border-cyan-400 rounded-lg px-[20px] py-[10px] bg-white  shadow-gray-200 shadow-lg "
          />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPass(e.target.value)}
            value={password}
            className="w-[60%] h-[40px] outline-none border-2 border-cyan-400 rounded-lg px-[20px] py-[10px] bg-white  shadow-gray-200 shadow-lg "
          />
          {err && <p className="text-red-400">{"*" + err}</p>}
          <button
            className="bg-cyan-400 px-5 py-2 rounded-2xl shadow-gray-300 shadow-lg text-white font-semibold hover:shadow-inner"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          <p className="cursor-pointer" onClick={() => navigate("/signup")}>
            Want to create a New Account
            <span className="text-cyan-400 pl-2"> Signup</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
