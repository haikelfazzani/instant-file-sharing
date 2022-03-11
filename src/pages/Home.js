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

  return <main className="bg-dark">
    <div>
      <h1>Create room</h1>

      {sharedLink && <div className="w-100">
        <h4><i className="fa fa-link mr-1"></i>Copy link and shared with your friend</h4>
        <CopyBox text={sharedLink} onCopy={onCopy} />
      </div>}

      {!sharedLink && !initiator
        && <div className="mb-2">
          <button className="bg-yellow" type="button" onClick={onCreateRoom}><i className="fa fa-plus mr-1"></i>Create room</button>
        </div>}
    </div>

  </main>
}
