import React from "react";
import Dashboard from "./Dashboard";

const Home = () => {
  const usertype = localStorage.getItem("usertype");
  console.log("Current user type:" + usertype);
  
  return (
    <Dashboard/>
  );
}

export default Home;