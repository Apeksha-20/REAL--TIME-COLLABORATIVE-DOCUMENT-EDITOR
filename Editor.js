import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Editor() {
  const [text, setText] = useState("");

  useEffect(() => {
    socket.emit("get-document", "12345");

    socket.on("load-document", (document) => {
      setText(document);
    });

    socket.on("receive-changes", (data) => {
      setText(data);
    });
  }, []);

  const handleChange = (e) => {
    setText(e.target.value);
    socket.emit("send-changes", e.target.value);
    socket.emit("save-document", e.target.value);
  };

  return (
    <textarea
      value={text}
      onChange={handleChange}
      style={{ width: "100%", height: "90vh" }}
    />
  );
}

export default Editor;
