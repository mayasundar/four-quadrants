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

            socket.on("disconnect", () => {
                delete users[socket.id];
                console.log("User disconnected:", socket.id);
            });
        });
        res.socket.server.io = io;
    }
    res.end();
}
