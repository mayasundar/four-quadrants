import { Server } from "socket.io";

let io;

export default function handler(req, res) {
    if (!res.socket.server.io) {
        io = new Server(res.socket.server, {
            path: "/api/socket",
            addTrailingSlash: false,
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });

        io.on("connection", (socket) => {
            console.log("User connected:", socket.id);

            socket.on("join-room", ({ room, name }) => {
                socket.join(room);
                console.log(`${name} joined room: ${room}`);

                socket.to(room).emit("player-joined", { name });
            });

            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });
        res.socket.server.io = io;
    }
    res.end();
}
