const socketio = require("socket.io");

const io = socketio();

exports.io = io;
exports.listenIO = (httpServer) => {
  io.attach(httpServer);
};

io.on("connection", (socket) => {
  console.log("on");
});
