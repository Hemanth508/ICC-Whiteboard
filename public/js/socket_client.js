'use strict';
const PASSWORD='ww';
(function() {
    //var socket = io();
var minimumMemCount=2;
var leaderName= '';
var userTotalCount = 1;
var UserWorkedLists = {};
var leadervotingStatus = false;
var leaderVotingStart=false;
var connectedUserName = localStorage.getItem("connectedUserName")
function description(){
  var desc = '';
  if(userTotalCount < minimumMemCount) {desc= "Waiting";
     $("description").text(desc);  }
  if (userTotalCount >= minimumMemCount && $("description").text()=="Waiting"){
    desc = "Voting"; $("description").text(desc);}
}

function chatting(data){
  var msg = data.msg;
  var reciever = data.reciever;
  var sender = data.user;
  var user=$("#userName").text();
  console.log(reciever)
  if (reciever){
   //private chattingbox
     if (reciever==user){
        //get new messages 
        var content = "<p class='reciever'>from " + sender + "</p>"+"<p> </p>" ;
        var content1= "<P class = 'recievermsg'>" + msg +"</p>";
        $("#msg_content").append(content);
        $("#msg_content").append(content1);

     } if(reciever!=user&& sender==user){
        //sent new message
        var content = "<p class='sender'>to " + reciever + "</p>"+"<p> </p>" ;
        var content1= "<P class = 'sendermsg'>" + msg +"</p>";
        $("#msg_content").append(content);
        $("#msg_content").append(content1);

     }
  } else{
      ///Global chattingbox
      if(user==sender){
          //sent new message
          var content = "<p class='sender'>to  global" + "</p>"+"<p> </p>" ;
          var content1= "<P class = 'sendermsg'>" + msg +"</p>";
          $("#msg_content").append(content);
          $("#msg_content").append(content1);
      }else{
          //get new message
          var content = "<p class='reciever'> from  " + sender + "</p>" +"<p> </p>";
          var content1 = "<P class = 'recievermsg'>" + msg +"</p>";
          $("#msg_content").append(content);
          $("#msg_content").append(content1);
        }
  }
  $("#msg_content").animate({ scrollTop: $("#msg_content").height() }, "slow");
}
function connectedUserFunction(connectedNewUser){
  userTotalCount+=1;
  var tx1= "<button id='" + connectedNewUser + "' class=btn_user onclick='voteStart("+"this"+")'>" + connectedNewUser + "</button><br>" ;
  $("#userLists").append(tx1);
  $("#userLists").animate({ scrollTop: $("#users").height() }, "slow");
  description();
  leaderName=localStorage.getItem('leaderName');
  if (!leaderName && $("description").text()=="Voted"){
    document.getElementById(connectedNewUser).disabled=true;
   }
   if($("description").text()=="Observer"){
      document.getElementById(connectedNewUser).disabled=true;
   }
  if(leaderName&& leaderName!=connectedUserName){
    //display leaderName to new user
     if(leaderName==connectedNewUser&& document.getElementById(leaderName)){
      document.getElementById(connectedNewUser).style.backgroundColor="rgb(0, 153, 153)";}
    //display joined users to new user
     if(UserWorkedLists[connectedNewUser]){document.getElementById(connectedNewUser).style.background="	#ff6666";}
    //disable new user if you are not leaderName.
    document.getElementById(connectedNewUser).disabled=true;
  }
  
}

function download(){
  var mycanvas = document.getElementById("whiteboardPlatform");
    var img    = mycanvas.toDataURL("image/png"); var a = document.createElement('a');
    a.href = img;a.download = "image.png";
    document.body.appendChild(a); a.click();
}
function saveError(){
  console.log("You can't save whiteboard platform!")
    $("#snackbar").text("You can't save whiteboard platform!");
    $("#snackbar").addClass("show");      
    setTimeout(function(){ $("#snackbar").removeClass("show")}, 3000);
}

function userDisconnectedFunctions(disconnectedUser){
  document.getElementById(disconnectedUser).nextSibling.remove();
  document.getElementById(disconnectedUser).remove();
  userTotalCount --;
  if(disconnectedUser==localStorage.getItem('leaderName')){
    localStorage.removeItem('leaderName');
    localStorage.removeItem('voted');
    $("description").text("Voting");
    $("#snackbar").text("Leader disconnected. You have to vote anohter leader!");
         $("#snackbar").addClass("show");      
         setTimeout(function(){ $("#snackbar").removeClass("show")}, 3000);
    var elems = document.getElementsByClassName("btn_user");
    for(var i = 0; i < elems.length; i++) {
        elems[i].disabled = false;
        elems[i].style.backgroundColor="";
    }
    leaderVotingStart=false;
    description();
  }
}
if(window.addEventListener) {
window.addEventListener('load', function () {
    socket.emit("userConnected", connectedUserName);
    socket.on('connect', () => {
        console.log("Connected!--",connectedUserName);
      });
      socket.on("userConnected", (connectedNewUser) => {
         connectedUserFunction(connectedNewUser);
    
    });
   
   
    socket.on("LEADERNAME", (data) => {console.log("LEADERNAME")
        leaderName=data; localStorage.setItem("leaderName",data);
        if($("#userName").text()!=leaderName) $("description").text("Observer")
       
    });
    socket.on("erro", (data) => {
      if (data){
        document.write("connection error!")
      }       
    });
    
    socket.on('workingAllowedUserList', (data) => {
     
        UserWorkedLists=data;
     }); 
     socket.on("systemLeaderVote", (data) => {
      console.log("systemLeaderVote----------");
      if (data == $("#userName").text()) {
        localStorage.setItem("leadervotingStatus",true)
        leadervotingStatus=true;
      }
    });

    socket.on("saveConfirmStatus", (data) => {
      SaveConfirm();
    });

  socket.on("chattingbox", (data) => {
    console.log("-chatting-",data.msg)
    chatting(data)

  });
  socket.on("saveResultStatus", (data) => {
    if(data){
      download();
    } else {
      saveError();

    }
  });



function SaveConfirm() {
    console.log('SaveConfirm function')
    document.getElementById('ButtonImageSave').style.display="inline-block";
    document.getElementById('ButtonImageCancel').style.display="inline-block";
    $("#snackbar").text("Do you  save witeboard platform?");
    $("#snackbar").addClass("show");      
    setTimeout(function(){ $("#snackbar").removeClass("show")}, 3000);
}
  socket.on("ERROR", (data) => {
      console.log("ERROR----!");
      //
    })



socket.on("DisconnectedUser", (disconnectedUser) => {
  console.log("disconnectedUser:",disconnectedUser)
  userDisconnectedFunctions(disconnectedUser);
 })


  function init () {

  }
  init();
  
    

}, false); }



//end


})();
