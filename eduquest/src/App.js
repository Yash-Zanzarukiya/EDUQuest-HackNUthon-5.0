import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header/Header";


import LoginPopup from "./components/LoginPopup/LoginPopup";
import Maincources from "./components/MainCources/Maincources";

import { Route } from "react-router";
import axios from "axios";
import VideoDetailsComponent from "./components/VideoDetailsComponent/VideoDetailsComponent";
function App() {
  const[data,setData] = useState([])
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3002/api/data")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);
  console.log(data)
  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}

      <BrowserRouter>
        <Header setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home data={data} />} />
          <Route path="/Courses" element={<Maincources data={data} />} />
          <Route path="/VideoContent" element={<VideoDetailsComponent />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
