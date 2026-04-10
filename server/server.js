const Document = require("./models/Document"); 
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");


const app = express();
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/task3DB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (data) => {
      socket.broadcast.to(documentId).emit("receive-changes", data);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
});
server.listen(5000, () => {
  console.log("Server running on port 5000");
});