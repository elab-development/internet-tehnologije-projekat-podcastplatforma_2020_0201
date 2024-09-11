import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WelcomePage from "./components/Welcome";
import ViewerHome from "./components/ViwerHome";
import HostHome from "./components/HostHome";
import AdminHome from "./components/AdminHome";
import AdminProfile from "./components/AdminProfile";
import UploadPodcast from "./components/UploadPodcast";
import HostProfile from "./components/HostProfile";
import ViewerProfile from "./components/ViewerProfile";
import FindPodcast from "./components/FindPodcast";
import Administriranje from "./components/Administriranje";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/viewer-home" element={<ViewerHome />} />
        <Route path="/host-home" element={<HostHome />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/host-profile" element={<HostProfile />} />
        <Route path="/viewer-profile" element={<ViewerProfile />} />
        <Route path="/upload-podcast" element={<UploadPodcast />} />
        <Route path="/find-podcast" element={<FindPodcast />} />
        <Route path="/administriranje" element={<Administriranje />} />
      </Routes>
    </Router>
  );
};

export default App;
