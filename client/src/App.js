import "./App.css";
import React, { useEffect } from "react";
import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import AllRoutes from "./Components/AllRoutes";
import DrawerSidebar from "./Components/LeftSidebar/DrawerSidebar";
import CreateEditChanel from "./Pages/Chanel/CreateEditChanel";
import { useDispatch } from "react-redux";
import { fetchAllChanel } from "./actions/chanelUser";
import VideoUpload from "./Pages/VideoUpload/VideoUpload";
import { getAllVideo } from "./actions/video";
import { getAlllikedVideo } from "./actions/likedVideo";
import { getAllwatchLater } from "./actions/watchLater";
import { getAllHistory } from "./actions/History";
import { VideoCall } from './Components/VideoCall/VideoCall';

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchAllChanel());
    dispatch(getAllVideo());
    dispatch(getAlllikedVideo());
    dispatch(getAllwatchLater());
    dispatch(getAllHistory());
  }, [dispatch]);

  const [toggleDrawerSidebar, setToggleDrawerSidebar] = useState({
    display: "none",
  });
  const toggleDrawer = () => {
    if (toggleDrawerSidebar.display === "none") {
      setToggleDrawerSidebar({
        display: "flex",
      });
    } else {
      setToggleDrawerSidebar({
        display: "none",
      });
    }
  };
  const [vidUploadPage, setVidUploadPage] = useState(false);
  const [EditCreateChanelBtn, setEditCreateChanelBtn] = useState(false);
  return (
    <Router>
      {vidUploadPage && <VideoUpload  setVidUploadPage={setVidUploadPage}/>}
      {EditCreateChanelBtn && (
        <CreateEditChanel setEditCreateChanelBtn={setEditCreateChanelBtn} />
      )}
      <Navbar
        setEditCreateChanelBtn={setEditCreateChanelBtn}
        toggleDrawer={toggleDrawer}
      />

      <DrawerSidebar
        toggleDrawer={toggleDrawer}
        toggleDrawerSidebar={toggleDrawerSidebar}
      />

      <Routes>
        <Route path="/video-call" element={<VideoCall />} />
        <Route path="*" element={<AllRoutes setVidUploadPage={setVidUploadPage} setEditCreateChanelBtn={setEditCreateChanelBtn} />} />
      </Routes>
    </Router>
  );
}

export default App;