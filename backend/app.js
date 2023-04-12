require('dotenv').config()
console.log(process.env.HARPERDB_URL)
const express=require('express')
const app=express()
const http=require('http')
const cors=require('cors')
const {Server}=require('socket.io')
const mongoose=require('mongoose')

const harperSaveMessage = require('./services/harper_save_message')
const harperGetMessages=require('./services/harper_get_messages')
const harperSaveRoom=require('./services/harper_save_room')
const harperCheckRoom=require('./services/harper_check_room')
const apiRoute=require('./routes/index')

app.use(cors())
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

const server=http.createServer(app);

function leaveRoom(userID, chatRoomUsers) {
  return chatRoomUsers.filter((user) => user.id != userID);
}

const io=new Server(server,{
  cors:{
    origin:'http://127.0.0.1:5173',
    methods:['GET','POST'],
  },
})

const CHAT_BOT='ChatBot'

let chatRoom=''
let allUsers=[]
let data=''

io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);
  //create new room
socket.on('createRoom', (roomName, password) => {
  harperSaveRoom(roomName,password)
   .then((response)=>console.log(response))
   .catch((err)=>console.log(err))
  socket.join(roomName);
  // io.sockets.adapter.rooms[roomName].password = password;
  socket.to(roomName).emit('roomCreated');
});
  //add user to password protected room
socket.on('join', (username,roomName, password,callback) => {
  // const room = io.sockets.adapter.rooms[roomName];
  harperCheckRoom(roomName)
  .then((response)=>{
    data=JSON.parse(response)
    console.log(data[0].password)
    if (data && data[0].password === password){
      let __createdtime__ = Date.now(); // Current timestamp
      socket.join(roomName);
      // Send welcome msg to user that just joined chat only
      socket.emit('receive_message', {
        message: `Welcome ${username}`,
        username: CHAT_BOT,
        __createdtime__,
      });
      callback(true);
    }
  })
  .catch((err)=>{
    console.log(err)
    callback(false);
  })
    
});
  // Add a user to a room
  socket.on('join_room', (data) => {
    const { username, room } = data; // Data sent from client when join_room event emitted
    socket.join(room); // Join the user to a socket room

    let __createdtime__ = Date.now(); // Current timestamp
    // Send message to all users currently in the room, apart from the user that just joined
    socket.to(room).emit('receive_message', {
      message: `${username} has joined the chat room`,
      username: CHAT_BOT,
      __createdtime__,
    });
    // Send welcome msg to user that just joined chat only
    socket.emit('receive_message', {
      message: `Welcome ${username}`,
      username: CHAT_BOT,
      __createdtime__,
    });
    // Save the new user to the room
    chatRoom = room;
    allUsers.push({ id: socket.id, username, room });
    chatRoomUsers = allUsers.filter((user) => user.room === room);
    socket.to(room).emit('chatroom_users', chatRoomUsers);
    socket.emit('chatroom_users', chatRoomUsers);

    // Get last 100 messages sent in the chat room
    harperGetMessages(room)
      .then((last100Messages) => {
        // console.log('latest messages', last100Messages);
        socket.emit('last_100_messages', last100Messages);
      })
      .catch((err) => console.log(err));
  });

  socket.on('send_message', (data) => {
    const { message, username, room, __createdtime__ } = data;
    io.in(room).emit('receive_message', data); // Send to all users in room, including sender
    harperSaveMessage(message, username, room, __createdtime__) // Save message in db
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  });

  socket.on('leave_room', (data) => {
    const { username, room } = data;
    socket.leave(room);
    const __createdtime__ = Date.now();
    // Remove user from memory
    allUsers = leaveRoom(socket.id, allUsers);
    socket.to(room).emit('chatroom_users', allUsers);
    socket.to(room).emit('receive_message', {
      username: CHAT_BOT,
      message: `${username} has left the chat`,
      __createdtime__,
    });
    console.log(`${username} has left the chat`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected from the chat');
    const user = allUsers.find((user) => user.id == socket.id);
    if (user?.username) {
      allUsers = leaveRoom(socket.id, allUsers);
      socket.to(chatRoom).emit('chatroom_users', allUsers);
      socket.to(chatRoom).emit('receive_message', {
        message: `${user.username} has disconnected from the chat.`,
      });
    }
  });
});

app.use("/api",apiRoute)
app.get('/',(req,res)=>{
  res.send('Hello World')
})

mongoose.connect("mongodb://localhost:27017/chatrooms", {
   useNewUrlParser: true,
   useUnifiedTopology: true
})
.then((response)=>console.log('MongoDb connected'))
.catch((err)=>console.log('Error connecting database'))

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

server.listen(7000,()=>'Server running on port 7000')


