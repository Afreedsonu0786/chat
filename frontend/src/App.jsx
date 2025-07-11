import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GetCurrentUser from "./hooks/GetCurrentUser";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import GetOtherUsers from "./hooks/GetOtherUsersData";
import { io } from "socket.io-client";
import { serverUrl } from "./main";
import { setOnlineUsers, setSocket } from "./redux/userSlice";

const App = () => {
  GetCurrentUser();
  GetOtherUsers();
  const { userData, socket, onlineUsers } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (userData) {
      const socketio = io(`${serverUrl}`, {
        query: {
          userId: userData?._id,
        },
      });
      dispatch(setSocket(socketio));
      socketio.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });

      return () => socketio.close("getOnlineUsers");
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [userData?._id]);

  return (
    <Routes>
      <Route
        path="/login"
        element={!userData ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/signup"
        element={!userData ? <Signup /> : <Navigate to="/profile" />}
      />
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/login" />}
      />
      <Route
        path="/profile"
        element={userData ? <Profile /> : <Navigate to="/signup" />}
      />
    </Routes>
  );
};

export default App;
