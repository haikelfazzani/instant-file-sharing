import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CopyBox from "../components/CopyBox";
import TokenService from "../services/TokenService";

export default function Home() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams()
  const initiator = searchParams.get("initiator");

  const [sharedLink, setSharedLink] = useState(null);
  const [roomURL, setRoomURL] = useState()

  const onCreateRoom = async () => {
    const { url, shared } = await TokenService.create();
    setSharedLink(shared);
    setRoomURL(url)
  }

  const onCopy = () => {
    navigate(roomURL);
  }

  return <main className="bg-dark text-center">

    <div className="w-100 mb-2">
      <img style={{ width: '300px', margin: 'auto' }}
        src="https://cdn.tresorit.com/webv10/dist/gatsby/static/a47b2a0b61bd4551e7d9129c7cc05081/5865e/secure-file-sharing-use-case-2.png"
        alt="file sharing"
      />
    </div>

    {sharedLink && <div className="w-100">
      <h4><i className="fa fa-link mr-1"></i>Copy link and shared with your friend</h4>
      <CopyBox text={sharedLink} onCopy={onCopy} />
    </div>}

    {!sharedLink && !initiator
      && <div className="w-100 text-uppercase">
        <h3 className="m-0">Create a secure room</h3>
        <h3>and start sharing files with yours friends</h3>
        <button type="button" onClick={onCreateRoom}><i className="fa fa-plus mr-1"></i>Create room</button>
      </div>}
  </main>
}
