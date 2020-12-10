const SERVER_URL = 'http://localhost:5400',
port =5400,
userConnected = "userConnected",
DisconnectedUser = "DisconnectedUser",
userCon ="connect",
previousDataview = "previousDataview",
userAllowed ="userAllowed",
chattingbox = "chattingbox",
systemLeaderVote = "systemLeaderVote",
workingAllowed = "workingAllowed",
 allDrawingData ="allDrawingData",
//save 
saveConfirmStatus = "saveConfirmStatus",
saveResultStatus = "saveResultStatus",
// drawing 
lineDrawingSocket = "lineDrawingSocket",
circleDrawingSocket = "circleDrawingSocket",
textDrawingSocket = "textDrawingSocket",
rectDrawingSocket = "rectDrawingSocket",
ellipseDrawingSocket = "ellipseDrawingSocket",
penDrawingSocket = "penDrawingSocket",
 deleteCanvasSocket = "deleteCanvasSocket",
 updateCanvasSocket = "updateCanvasSocket"

 const bodyParser = require('body-parser');
 var express = require('express');
 var app = express();
var cors = require('cors');
var corsOptions = {
  origin: 'http://localhost:5400',optionsSuccessStatus: 200 , methods: "GET,POST, PUT"
}
var path = require('path');

var httpServer = require('http').createServer(app);


app.use(express.static(path.join(__dirname, 'public'))); //  "public" off of current is root
app.use(cors(corsOptions));


let userConLists = {};
let UserWorkedLists = {};
let totalUserData=[];
let previousData=[];
let votingUserNameList = {};
let totalUserCount = 0;
let totalVotingCount = 0;
let systemLeader = '';
let saveApproveCount = 1;
let saveResponseCount = 1;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post('/signin', (req, res) => {
 
  let connectedUserName = req.body.user;
  console.log("connectedUserName---",connectedUserName);
  if (userConLists[connectedUserName] == undefined) {
      res.send("successful"); } else {
      res.send("fail");
  }
});
const io = require('socket.io')(httpServer, {
  cors: {
      origin: 'http://localhost:5400',
      methods: ["GET", "POST"]
  }
});

var server=httpServer.listen(port,function(){
  var host = server.address().address; var port = server.address().port
   
   console.log("whiteboard app listening at http://localhost:%s", port)
});
function userconnectedFunction(connectedNewUser,socket){
  console.log('connectedNewUser')
  if(userConLists[connectedNewUser]!=undefined){
    console.log("totalUserData")
    socket.emit("ERROR",true);
  }
  else {
        console.log(`${connectedNewUser}`);
        if (systemLeader){
          console.log("workinguserlist",UserWorkedLists)
          io.emit("LEADERNAME",systemLeader);
          io.emit("workingAllowedUserList",UserWorkedLists);
          socket.emit(workingAllowed,systemLeader);
        }
        for (let currentUser in userConLists) {
          socket.emit(userConnected, currentUser);
        }
        userConLists[connectedNewUser] = socket.id;
        let connectedNewUserdata = {connectedUserName:connectedNewUser,socketId:socket.id}
        totalUserData.push(connectedNewUserdata);
        console.log("totalUserData",totalUserData)
        totalUserCount ++;
                 
        socket.broadcast.emit(userConnected, connectedNewUser);
    } 
}

io.on(userCon, (socket) => {
  console.log('a user connected');
 
  socket.on(userConnected, (connectedNewUser) => {
      userconnectedFunction(connectedNewUser,socket)
   
});
  socket.on('disconnect', () => {
    var disconnecteUserId= socket.id;
    console.log("disconnecteUserId",disconnecteUserId)
    for (let user in userConLists) {
      console.log("disconeed!",userConLists)
      if(userConLists[user]==disconnecteUserId){
        if(user==systemLeader){
          totalVotingCount=0; systemLeader='';saveApproveCount=1;          
          votingUserNameList = {}; saveResponseCount =1;
        }
        delete userConLists[user];
        if(UserWorkedLists[user]) delete UserWorkedLists[user];
        socket.broadcast.emit(DisconnectedUser, user); totalUserCount --;
      }
  }
  console.log("userConLists",userConLists);
  });

socket.on(systemLeaderVote, (data) => {
  var votingUserName,connectedUserName;
  for (const [key, val] of Object.entries(data)) {
    if (key=="connectedUserName")connectedUserName=val
    else votingUserName = val  
  }
  console.log("user---",votingUserName,"--connectedUserName--",connectedUserName);
  io.emit(systemLeaderVote,connectedUserName);

  if (votingUserNameList[votingUserName] != undefined) {
      votingUserNameList[votingUserName] = votingUserNameList[votingUserName] + 1;
  } else {
      votingUserNameList[votingUserName] = 1;
  }
  totalVotingCount ++;
  if (totalVotingCount == totalUserCount) {
      let maximCount = 0, maxCountUser;
      for (let user in votingUserNameList) {
          let votedCount = votingUserNameList[user];
          if (maximCount < votedCount) {
            maximCount = votedCount;  maxCountUser = user;
          }
      }
      systemLeader = maxCountUser;
      /// systemLeader of this whiteboard system
      io.emit(workingAllowed, systemLeader);
  }
});


socket.on(allDrawingData, function(data){
  previousData.push(data);
  console.log("allDrawingData",data);
});



socket.on(previousDataview, (workinguser) => {
  
  for (const [key, data] of Object.entries(previousData)) {
    for (let type in data) {
      socket.emit(type,data[type]);
      socket.emit('updateCanvasSocket', true);
     }
   
  }
   
});
socket.on(userAllowed, (workingAllowUser) => {
  console.log(`${workingAllowUser}`);
  UserWorkedLists[workingAllowUser]=workingAllowUser;
  console.log(workingAllowUser)
  socket.broadcast.emit(userAllowed, workingAllowUser);
   
});


socket.on(chattingbox, (data) => {
  console.log(`chattingbox -- ${data}`);

    io.emit(chattingbox, data);
   
});

socket.on(deleteCanvasSocket, function(DATA){
  previousData=[];
  socket.broadcast.emit(deleteCanvasSocket, false);
  console.log('deleteCanvasSocket',DATA,":end");
});
   // update
   socket.on(updateCanvasSocket, function(DATA){
    socket.broadcast.emit(updateCanvasSocket, DATA);
    console.log('updateCanvasSocket',DATA,":end");
  });
   //text 
   socket.on(textDrawingSocket, function(DATA){
    socket.broadcast.emit(textDrawingSocket, DATA);
    console.log('textDrawingSocket',DATA,":end");
  });
   //line  
   socket.on(lineDrawingSocket, function(DATA){
    socket.broadcast.emit(lineDrawingSocket, DATA);
    console.log('lineDrawingSocket',DATA,":end");
  });
  //ellipse 
  socket.on(ellipseDrawingSocket, function(DATA){
    socket.broadcast.emit(ellipseDrawingSocket, DATA);
    console.log("ellipseDrawingSocket",DATA,":end");
  });
  //circle 
   socket.on(circleDrawingSocket, function(DATA){
    socket.broadcast.emit(circleDrawingSocket, DATA);
    console.log("circleDrawingSocket",DATA,":end");
  });
  
 
 //pen 
  socket.on(penDrawingSocket, function(DATA){
    socket.broadcast.emit(penDrawingSocket, DATA);
    console.log(DATA);
  });
  
 
  //rectangle 
  socket.on(rectDrawingSocket, function(DATA){
    socket.broadcast.emit(rectDrawingSocket, DATA);
    console.log('rectDrawingSocket',DATA);
  });

  socket.on(saveConfirmStatus, function(data){
    console.log("saveConfirmStatus");
    socket.broadcast.emit(saveConfirmStatus, data);
  });
  socket.on(saveResultStatus, function(data){
    saveResultFunction(data)
    
  });

 

});
function saveResultFunction(data){
  console.log("saveResultStatus");
    if(data) saveApproveCount ++;
    saveResponseCount ++;
    if(saveResponseCount==totalUserCount){
      if (saveApproveCount > saveResponseCount/2){
        console.log("saveApproveCount")
            saveApproveCount=1; saveResponseCount =1;
        io.emit(saveResultStatus, true);
      } else{
        console.log("Fail.")
        io.emit(saveResultStatus, false);
      }
    }
    
    console.log("totalUserCount:",totalUserCount);
    console.log("saveResponseCount--",saveResponseCount);  
}