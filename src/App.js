import { useState } from "react";
import { Routes, Route, useSearchParams, useNavigate, Navigate } from "react-router-dom";

import About from "./pages/About";
import FileShare from "./pages/FileShare";
import CopyBox from "./components/CopyBox";
import Footer from "./components/Footer";
import nanoid from "./utils/nanoid";
import makeid from "./utils/makeid";

export default function App() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams()
  const initiator = searchParams.get("initiator");
  const [sharedLink, setSharedLink] = useState(null);

  const onCreateRoom = () => {
    const room = nanoid();
    const link = '?room=' + room + '&initiator=true';
    setSharedLink(window.location.origin + link.replace('true', 'false') + '&username=' + makeid(5))
    navigate('/' + link + '&username=' + makeid(5));
  }

  return (<>
    <main>
      <div></div>
      <div>
        <h1><i className="fa fa-share mr-1"></i>Instant</h1>

        <div className="mb-2">
          <h4 className="mb-0"><i className="fa fa-cog mr-1"></i>How it works</h4>
          <p className="gray">transfer files directly from one browser to another without going through an intermediary server by utilizing WebRTC. Files are encrypted in your browser using the password you provide. The files are decrypted in the receiver's browser using the same password.</p>
        </div>

        {sharedLink && <div className="w-100">
          <h4><i className="fa fa-link mr-1"></i>Copy link and shared with your friend</h4>
          <CopyBox text={sharedLink} />
        </div>}

        {!sharedLink && (!initiator || initiator === 'true')
          && <div className="mb-2">
            <button type="button" onClick={onCreateRoom}><i className="fa fa-plus mr-1"></i>Create room</button>
          </div>}
      </div>

      <Footer />
    </main>

    <>
      <Routes>
        <Route index path="/" element={<FileShare />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  </>);
}
