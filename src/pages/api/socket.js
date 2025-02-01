import { Server } from "socket.io";

let io;
const users = {};
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
            users[socket.id]={name:"", room:""};
            socket.on("check-name", (room)=>{
                if(!users[socket.id]?.name){
                    socket.emit("redirect-name", room);
                    console.log("Redirecting to name entry:", socket.id);
                }
            });

            socket.on("join-room", ({ room, name }) => {
                if(name && name.trim()!==""){
                    users[socket.id] = { name, room };
                    socket.join(room);
                    console.log(`${name} joined room: ${room}`);

                    socket.to(room).emit("player-joined", { name });
                }
                else {
                    socket.emit("redirect-name", room);
                }
            });

            socket.on("get-players", (room) => {
                const players = Object.values(users).filter((user) => user.room === room);
                io.to(room).emit("update-players", players);
            });

            socket.on("add-circle", ({ roomCode, circles }) => {
                io.to(roomCode).emit("add-circle", { circles });
            });
            socket.on("delete-circle", ({ roomCode, id }) => {
                io.to(roomCode).emit("delete-circle", { id });
            });

            socket.on("update-circle", ({ roomCode, id, newX, newY }) => {
                io.to(roomCode).emit("update-circle", { id, newX,newY });
            });

            socket.on("update-circle-text", ({ roomCode, id, newText }) => {
                io.to(roomCode).emit("update-circle-text", { id, newText });
            });

            socket.on("update-axis-labels", ({roomCode, top, left, right, bottom})=>{
                io.to(roomCode).emit("update-axis-labels", {top, left, right, bottom});
            })

            socket.on("disconnect", () => {
                delete users[socket.id];
                console.log("User disconnected:", socket.id);
            });
        });
        res.socket.server.io = io;
    }
    res.end();
}
