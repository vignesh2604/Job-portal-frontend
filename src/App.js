import React, { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom"; // No need for BrowserRouter here
import Home from "./components/Home";
import SignIn from "./components/Signin";
import SignUp from "./components/SignUp";
import JobSearch from "./components/JobSearch";
import Account from "./components/Account";
import Navbar from "./components/Navbar";
import JobCreation from "./components/JobCreation";
import JobApplication from "./components/JobApplication";
import RecruiterJobList from "./components/RecruiterJobList";
import ContactPage from "./components/ContactPage";

const App = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  const handleLogin = (userDetails) => {
    setUser(userDetails);
  };

  return (
    <>
       {location.pathname !== "/"  && location.pathname !== "/signup" && <Navbar user={user} />}
      <Routes> {/* Use Routes to wrap your Route components */}
        <Route path="/" element={<SignIn onLogin={handleLogin} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/jobs" element={<JobSearch />} />
        <Route path="/createjobs" element={ <JobCreation/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/account" element={<Account />} />
        <Route path="/applyjobs" element={<JobApplication/>} />
        <Route path="/applicantList" element={<RecruiterJobList />} />
        <Route path="/contact" element={<ContactPage/>} />
      </Routes>
    </>
  );
};

export default App;
