import Socket from 'socket.io-client'
const url = process.env.REACT_APP_BACKEND_URL+ ":80" || "http://localhost5000";
export const socket: SocketIOClient.Socket = Socket(url);

