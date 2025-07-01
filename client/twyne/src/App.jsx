import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import Discoversection from "./Components/Discoversection";
import Profile from "./Components/Profile";
import Footer from "./Components/Footer";
import MatchCard from "./Components/MatchCard";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import PreferencesForm from "./Components/PreferencesForm";
import MessageInput from "./Components/MessageInput";
import ChatWindow from "./Components/ChatWindow";
import MyMatches from "./Components/MyMatches";
import ReportButton from "./Components/ReportButton";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/preferences" element={<PreferencesForm />} />
        <Route path="/matches" element={<MyMatches />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<ChatWindow />} />
        <Route path="/report" element={<ReportButton />} />

      </Routes>
      <Footer />
    </>
  );
}

export default App;