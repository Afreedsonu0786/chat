import React from "react";
import Sidebar from "../components/Sidebar";
import MessageArea from "../components/MessageArea";
import { useSelector } from "react-redux";
import GetMessages from "../hooks/GetMessages";

const Home = () => {
  let { selectedUser } = useSelector((state) => state.user);
  GetMessages();
  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar />
      <MessageArea />
    </div>
  );
};

export default Home;
