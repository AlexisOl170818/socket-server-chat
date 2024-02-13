const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: { origin: true, credentials: true, methods: ["GET", "POST"] },
});
const userList = [];

io.on("connection", (client) => {
  client.emit("getClientId", client.id);
  client.on("join", (username) => {
    client.broadcast.emit("newUserConected", userList);
    userList.push({ id: client.id, username: username });

    io.emit("newUserConected", userList);
  });
  client.on("sendMessage", (messageInfo) => {
    console.log("enviando un mensaje");
    console.log(messageInfo);

    //  console.log(messageInfo.toUser);
    io.to(messageInfo.toUser).emit("reveiceMessage", messageInfo);
  });
});

app.get("/", (req, res) => {
  res.send("hola mundo");
});
http.listen(3000, () => {
  console.log("puerto 3000");
});
