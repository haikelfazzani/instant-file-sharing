import { useState } from "react";
import axios from "axios";
import { Routes, Route, useSearchParams, useNavigate, Navigate } from "react-router-dom";

import About from "./pages/About";
import FileShare from "./pages/FileShare";
import CopyBox from "./components/CopyBox";
import Footer from "./components/Footer";
import nanoid from "./utils/nanoid";
import makeid from "./utils/makeid";

const proxy_server = process.env.NODE_ENV === 'production'
  ? 'https://instant-sharing.onrender.com'
  : 'http://localhost:5000';

export default function App() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams()
  const initiator = searchParams.get("initiator");
  const [sharedLink, setSharedLink] = useState(null);

  const onCreateRoom = async () => {
    const room = nanoid();
    const username = makeid(5);
    const friendUsername = makeid(5);
    const link = '?room=' + room + '&initiator=true';

    const token = await axios.get(proxy_server + '/token/create?room=' + room + '&username=' + username);
    const tokenFriend = await axios.get(proxy_server + '/token/create?room=' + room + '&username=' + friendUsername);

    setSharedLink(window.location.origin + link.replace('true', 'false') + '&username=' + friendUsername + '&token=' + tokenFriend.data)
    navigate(link + '&username=' + username + '&token=' + token.data);
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

        {sharedLink && initiator && <div className="w-100">
          <h4><i className="fa fa-link mr-1"></i>Copy link and shared with your friend</h4>
          <CopyBox text={sharedLink} />
        </div>}

        {!sharedLink && !initiator
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
