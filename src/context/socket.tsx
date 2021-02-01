import Socket from 'socket.io-client'
const url = process.env.REACT_BACKEND_URL;
export const socket: SocketIOClient.Socket = Socket(url || "http://localhost:5000");

