import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GetCurrentUser from "./hooks/GetCurrentUser";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import GetOtherUsers from "./hooks/GetOtherUsersData";

const App = () => {
  GetCurrentUser();
  GetOtherUsers();
  const { userData } = useSelector((state) => state.user);
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
