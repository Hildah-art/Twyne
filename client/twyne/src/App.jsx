import React from "react";
import "./styles/index.css";
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
    <div>
<Navbar />
<Hero />
<Signup />
<Login />
<PreferencesForm />

<MatchCard />
<MyMatches />
<ChatWindow />

<Profile />
<ReportButton />
<Footer />

      
      
      
    </div>
  );
}

export default App;