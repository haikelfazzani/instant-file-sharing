import { useState, useEffect, useRef } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import { FileUploader } from "react-drag-drop-files";
import Spinner from "../components/Spinner";
import iceServersConfig from "../utils/iceServersConfig";
import downloadFile from "../utils/downloadFile";
import streamSaver from "streamsaver";

import './FileShare.css'
import axios from "axios";

const fileTypes = ["JPG", "PNG", "GIF", "PDF", "DOCX", "TXT", "JSON"];

const proxy_server = process.env.NODE_ENV === 'production'
  ? 'https://instant-sharing.onrender.com'
  : 'http://localhost:5000';

const io = window.io;
const Peer = window.SimplePeer;
const worker = new window.Worker('/worker.js');

const FileTable = ({ file }) => {
  if (file) {
    return <table className="w-100 br7 mb-3">
      <thead><tr><th>file name</th><th>size</th></tr></thead>
      <tbody>
        <tr>
          <td>{file.name}</td>
          <td>{parseInt(file.size / 1024, 10)} kb</td>
        </tr>
      </tbody>
    </table>
  }
  else return <></>
}

export default function FileShare() {

  let navigate = useNavigate();

  // url params
  const [searchParams] = useSearchParams();
  const RoomId = searchParams.get("room");
  const initiator = JSON.parse(searchParams.get("initiator"));
  const username = searchParams.get("username");
  const token = searchParams.get("token");

  // socket
  const socket = useRef();
  const [roomUsers, setRoomUsers] = useState([]);

  const [userId, setUserId] = useState();
  const [user, setUser] = useState({ username, initiator, RoomId });

  const callerRef = useRef(null);
  const receiverRef = useRef(null);

  const [message, setMessage] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null)
  const [fileInfos, setFileInfos] = useState(null)

  useEffect(() => {

    axios.get(proxy_server + '/token/verify?token=' + token + '&room=' + RoomId + '&username=' + username)
      .then(result => {
        console.log(result.data);

        socket.current = io.connect(proxy_server, { forceNew: true });
        socket.current.emit('join-room', { RoomId, username, initiator });

        socket.current.on('get-my-id', id => {
          setUserId(id);
        });

        socket.current.on('new-user-join-room', async ({ message, fullRoom }) => {
          if (fullRoom) {
            socket.current.disconnect();
            navigate("/");
          }
          else {
            setMessage(message)
            socket.current.emit('get-users-room', RoomId);
            const audio = new Audio('https://www.myinstants.com/media/sounds/google-meet-ask-to-join-sound.mp3')
            await audio.play();
          }
        });

        socket.current.on('room-users', users => {
          if (users.length > 1 && initiator) {
            const userToCallID = users.find(u => !u.initiator).id;
            callerPeer(userToCallID)
          }
          setRoomUsers(users)
        });

        socket.current.on('caller-signal', ({ signal, from }) => {
          if (!initiator && from && signal) receiverPeer(from, signal)
        });

        socket.current.on("on-receiver-signal", signal => {
          if (signal && callerRef.current) {
            callerRef.current.signal(signal);
          }
        });

        socket.current.on('file-status', ({ message, username }) => {
          setMessage(message + ' | ' + username)
        });

        socket.current.on('leave-room', ({ message, users }) => {
          setRoomUsers(users);
          setMessage(message)
        });

        socket.current.on('disconnect', () => {
          if(roomUsers.length < 2) navigate("/");
        });
      })
      .catch(e => {
        navigate("/");
      });

    return () => {
      callerRef.current = null;
      receiverRef.current = null;
      if (socket.current) socket.current.close();
      worker.removeEventListener('message', onWorkerMessage);
    }
  }, [RoomId]);

  function callerPeer(to) {
    if (callerRef.current) return;
    callerRef.current = new Peer({
      initiator: true, trickle: false, config: iceServersConfig
    });

    callerRef.current.on("signal", signal => {
      socket.current.emit("signaling", { signal, from: userId, to })
    });

    callerRef.current.on('error', () => {
      setUser([]);
      socket.current.disconnect();
    })
  }

  function receiverPeer(to, signal) {
    if (receiverRef.current) return;

    receiverRef.current = new Peer({ initiator: false, trickle: false, config: iceServersConfig });

    receiverRef.current.on("signal", signal => {
      socket.current.emit("receiver-signal", { signal, to });
    });

    receiverRef.current.on('data', data => {
      if (data.toString().includes('done')) {
        setFileInfos(JSON.parse(data))
      } else {
        worker.postMessage(data)
      }
    });

    receiverRef.current.on('error', () => {
      setUser([]);
      socket.current.disconnect();
    });

    receiverRef.current.signal(signal);
  }

  const onWorkerMessage = event => {
    // const stream = event.data.stream();
    // const fileStream = streamSaver.createWriteStream(fileInfos.name);
    // stream.pipeTo(fileStream);    
    downloadFile(event.data, fileInfos.name)
    worker.removeEventListener('message', onWorkerMessage);

    socket.current.emit("file-status", {
      RoomId, message: 'Success Download', username
    });
    setFileInfos(null);
  }

  const onDowloadFile = () => {
    worker.postMessage('download')
    worker.addEventListener('message', onWorkerMessage);
  }

  const onSendFile = async () => {
    const peer = callerRef.current;
    const chunksize = 64 * 1024;
    let offset = 0;

    while (offset < selectedFile.size) {
      const chunkfile = await selectedFile.slice(offset, offset + chunksize);
      const chunk = await chunkfile.arrayBuffer();
      handleChunk(chunk);
      offset += chunksize;
    }

    peer.write(JSON.stringify({
      done: true,
      name: selectedFile.name.replace(/\s+/g, '-'),
      size: selectedFile.size
    }));

    setSelectedFile(null);

    socket.current.emit("file-status", {
      RoomId, message: 'You are receiving file from ', username
    });

    function handleChunk(buf) {
      let uint8View = new Uint8Array(buf);
      peer.write(uint8View);
    }
  }

  return (<main className="bg-dark position-relative">

    <div className="w-100 h-100 d-flex flex-column justify-center align-center py-5">

      {initiator && <div className="w-100 text-center">
        {roomUsers.length > 1
          ? <>
            <div className="drop-zone mb-3">
              <FileUploader handleChange={(file) => { setSelectedFile(file); }} name="file" types={fileTypes} />
            </div>

            <FileTable file={fileInfos || selectedFile} />

            {selectedFile && <button className="bg-yellow" onClick={onSendFile}>
              <i className="fa fa-paper-plane mr-1"></i>send file
            </button>}
          </>
          : <>
            <Spinner />
            <h3>Waiting for friend to connect</h3>
          </>}
      </div>}

      {!initiator && <div className="w-100 text-center">
        {fileInfos
          ? <>
            <span><i className="fas fa-cloud-download-alt"></i></span>
            <FileTable file={fileInfos || selectedFile} />
            <button className="bg-yellow" onClick={onDowloadFile}>
              <i className="fa fa-download mr-1"></i>download
            </button>
          </>
          : <>
            <Spinner />
            <h3>Waiting for a connection</h3>
          </>}
      </div>}
    </div>

    {(roomUsers.length > 0 && userId && username) && <div
      className="w-100 p-1"
      style={{ position: 'absolute', top: '0', left: '0', padding: '10px 20px' }}
    >
      <small className="light text-uppercase">
        <i className="fa fa-circle green mr-1"></i>{roomUsers.length} Connected Users
      </small>

      <div className="w-100 d-flex mt-1">
        {roomUsers.map(u => <div key={u.id}
          className={"mr-3 " + ((u.id === userId || u.username === username) ? 'yellow' : 'shake')}>
          <span><i className={"fa fa-" + ((u.id === userId || u.username === username) ? 'user mr-1' : 'smile mr-1')}></i></span>
          <span>{(u.id === userId || u.username === username) ? `You (${u.username})` : u.username}</span>
        </div>)}
      </div>
    </div>}

    {message && <div className="snackbar bg-pistachio">
      <span>{message}</span>
      <button className="bg-yellow" onClick={() => { setMessage(null) }}>X</button>
    </div>}
  </main>);
}