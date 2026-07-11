import { io } from "socket.io-client";

const socket = io(
  "http://https://d-entertainment-backend.onrender.com",
);

export default socket;