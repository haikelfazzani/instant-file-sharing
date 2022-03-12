import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Room from "./pages/Room";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return <>
    <main className="justify-between">
      <div></div>
      <div>
        <h1><i className="fa fa-share mr-1"></i>Instant</h1>
        <p className="gray">Instant is a secure P2P platform to send and share your photos and memories, your favorite videos and music, as well as your personal and professional documents using WeBRTC datachannels (No server in the middle).</p>
        <h3 className="mb-0"><i className="fa fa-check mr-1"></i>Send large files</h3>
        <h3 className="m-0"><i className="fa fa-check mr-1"></i>No need to install any software</h3>
        <h3 className="m-0"><i className="fa fa-check mr-1"></i>It's 100% free, no registration required</h3>
      </div>

      <Footer />
    </main>

    <Routes>
      <Route index path="/" element={<Home />} />
      <Route path="/sharing" element={<PrivateRoute><Room /></PrivateRoute>} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </>
}
