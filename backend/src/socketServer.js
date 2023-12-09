import User from "./models/userModel.js";

let onlineUsers = [];
let currConversation = null;
export default function (socket, io) {
  socket.on("join", (user) => {
    socket.join(user);

    if (!onlineUsers.some((u) => u.userId === user)) {
      onlineUsers.push({ userId: user, socketId: socket.id });
    }

    io.emit("get-online-users", onlineUsers);

    io.emit("setup socket", socket.id);
  });

  socket.on("join conversation", (conversation) => {
    socket.join(conversation);
    currConversation = conversation;
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("get-online-users", onlineUsers);
  });

  // send message
  socket.on("send message", (message) => {
    let conversation = message.conversation;

    if (!conversation.users) return;

    conversation.users.forEach((user) => {
      if (user._id === message.sender._id) return;

      socket.in(user._id).emit("recieve message", message);
    });
  });
  //typing
  socket.on("typing", (conversation) => {
    console.log(conversation + "is typing");

    socket.in(conversation).emit("typing", conversation);
  });

  socket.on("stop typing", (conversation) => {
    socket.in(conversation).emit("stop typing");
  });

  // call user
  socket.on("call user", async (data) => {
    let user = await User.findById(data.callerId);

    const recievedUserId = data.userToCall;
    const userSocketId = onlineUsers.find(
      (user) => user.userId === recievedUserId
    );

    io.to(userSocketId.socketId).emit("call user", {
      signal: data.signal,
      from: data.from,
      name: user.name,
      photo: user.photo,
    });
  });

  // answer call
  socket.on('answer call',data => {
    io.to(data.to).emit('call accepted',data.signal)
  })
}
