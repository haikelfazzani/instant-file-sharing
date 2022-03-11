import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Room from "./pages/Room";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return <>
    <main>
      <div></div>
      <div>
        <h1><i className="fa fa-share mr-1"></i>Instant</h1>

        <div className="mb-2">
          <h4 className="mb-0"><i className="fa fa-cog mr-1"></i>How it works</h4>
          <p className="gray">transfer files directly from one browser to another without going through an intermediary server by utilizing WebRTC. Files are encrypted in your browser using the password you provide. The files are decrypted in the receiver's browser using the same password.</p>
        </div>

      </div>

      <Footer />
    </main>

    <Routes>
      <Route index path="/" element={<Home />} />
      {/* <PrivateRoute path="/room" component={Room} /> */}
      <Route path="/room" element={<PrivateRoute><Room /></PrivateRoute>} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </>
}
