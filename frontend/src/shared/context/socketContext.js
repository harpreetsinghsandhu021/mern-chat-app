import { createContext } from "react";
import { io } from "socket.io-client";

export const socket = io(process.env.REACT_APP_API_URL.split("/api/v1")[0]);

export const SocketContext = createContext();
