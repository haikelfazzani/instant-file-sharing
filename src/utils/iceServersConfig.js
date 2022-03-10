const iceServersConfig = {
  iceServers: process.env.NODE_ENV === 'production'
    ? [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
      {
        urls: 'turn:numb.viagenie.ca',
        username: 'bestprod2bp@gmail.com',
        credential: 'BfNy4YgRW!As28p'
      },
      {
        urls: "turn:openrelay.metered.ca:80",
        username: "openrelayproject",
        credential: "openrelayproject"
      },
      {
        urls: "turn:openrelay.metered.ca:443",
        username: "openrelayproject",
        credential: "openrelayproject"
      }
    ]
    : [{ urls: 'stun:stun.l.google.com:19302' }]
}

export default iceServersConfig;