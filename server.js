const express = require("express");
const app = express();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "shaurya.attal@gmail.com",
    pass: "uqzcvhoyatqpsnyb",
  },
});

app.set("view engine", "ejs");
app.use(express.static("public"));

const { ExpressPeerServer } = require("peer");

const server = require("http").Server(app);
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.use("/peerjs", peerServer);
const { v4: uuidv4 } = require("uuid");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

// respond with "hello world" when a GET request is made to the homepage
app.get("/", (req, res) => {
  //   res.render("index")
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("index", { roomId: req.params.room });
});

app.use(express.json())

app.post("/sendmail", async (req, res) => {
  const to = req.body.to;
  const url = req.body.url;

  console.log(req.body.to)

  const data = {
    from: {
      name: "shaurya",
      address: "shaurya.attal@gmail.com",
    },
    to: to,
    subject: "Join Video Chat With Me!",  
    html: `<p>hey there, join the video meet at 5 pm. Here is the link: -${url}</p>`,
  };


  transporter.sendMail(data, (error, info) => {
    if (error) {
      return console.log(error);
    }
    res
      .status(200)
      .send({ message: "Invitation sent!", message_id: info.messageId });
  });
  transporter.close()
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    console.log(roomId + " : " + userId + " : " + userName);
    socket.join(roomId);
    io.to(roomId).emit("user-connected", userId);
    socket.on("student", (message) => {
      //io.emit("createMessage", message)
      io.to(roomId).emit("createMessage", message, userName);
      console.log("what msg: ", message);
    });
  });
});

server.listen(3000);
