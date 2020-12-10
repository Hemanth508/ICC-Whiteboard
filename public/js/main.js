'use strict';

(function() {
 
  var UserWorkedLists={};
  var socket = io();
  var connectedUserName=localStorage.getItem("connectedUserName");
  var userTotalCount=1;
  var leaderName = "" ;
  var minimumMemCount=2;
  var leaderVotingStart = false;
  var currentPicingLineThincness;
  var currentPicingFontFamily;
  localStorage.setItem('leaderVotingStart',leaderVotingStart)
  var currentPicingColor;
  var currentPicingFontSize; 
  var canvasDrawToolsSet = {};
  var TextAreaTool;
  var myCanvasElementObject, 
  get2dCanvObject,
  temporaryCanvasObject,
  canvasContextObject;
var currentPickingTool;
var defaulTool = 'pencildrawing';
  function workingAllowed(leaderName1){
    localStorage.setItem('leaderName',leaderName1);
    leaderName=localStorage.getItem('leaderName');
    console.log("leaderName:",leaderName)
    if (connectedUserName == leaderName1){
      $("#snackbar").text("You elected as leader!");
      $("#snackbar").addClass("show");      
      setTimeout(function(){ $("#snackbar").removeClass("show")}, 3000);
      document.getElementById('ButtoImageClear').disabled=false;
      document.getElementById('ButtonImageSave').style.display="inline-block";
      var elems = document.getElementsByClassName("btn_user");
          for(var i = 0; i < elems.length; i++) {
              elems[i].disabled = false;
          }
      container.appendChild(myCanvasElementObject);
  
    } else{   
      if(!UserWorkedLists[connectedUserName]){
      if( document.getElementById(leaderName1)){
      document.getElementById(leaderName1).style.backgroundColor="rgb(0, 153, 153)";}
      document.getElementById('description').innerHTML="Observer";
      $("#snackbar").text(`The leader of this systme is ${leaderName1} `);
      $("#snackbar").addClass("show");      
      setTimeout(function(){ $("#snackbar").removeClass("show")}, 3000);
    }}
  }
if(window.addEventListener) {
window.addEventListener('load', function () {
 
  socket.on('workingAllowedUserList', (data) => {
    console.log("workingAllowedUserList:",data);
    UserWorkedLists=data;
 }); 


  socket.on("userAllowed", (workingUser) => {
    console.log("workingUser:",workingUser)
    if(document.getElementById(workingUser)){
       document.getElementById(workingUser).style.backgroundColor="	#ff6666";
      }
    if(connectedUserName==workingUser){
      console.log("connectedUserName:",connectedUserName,":workingUser:",workingUser);
      $("description").text("Working");
      $("#snackbar").text("You can work on this  system!");
      $("#snackbar").addClass("show");      
      setTimeout(function(){ $("#snackbar").removeClass("show")}, 3000);
      container.appendChild(myCanvasElementObject);
      socket.emit("previousDataview",workingUser);
    }
   })
   socket.on("workingAllowed", (leaderName1) => {
    console.log("leaderName:",leaderName1)
    workingAllowed(leaderName1)
   
  })
 
   function description(){
    var desc = '';
    if(userTotalCount < minimumMemCount) {desc= "Waiting";
       $("description").text(desc);
        }
    if (userTotalCount >= minimumMemCount && $("description").text()=="Waiting"){
      desc = "Voting";
      $("description").text(desc);
    }
   
  
  }



  function init () {
  
    $("#ButtonImageCancel").click(function(){
      socket.emit("saveResultStatus", false);
      document.getElementById('ButtonImageSave').style.display="none";
      document.getElementById('ButtonImageCancel').style.display="none";
      description();
    });
    //save canvas as png file to download folder
    $("#ButtonImageSave").click(function(){
      console.log("leaderName and connectedUserName ",leaderName,":connectedUserName:",connectedUserName)
      if(leaderName==connectedUserName){
          socket.emit("saveConfirmStatus", connectedUserName);
        }else{
          socket.emit("saveResultStatus", connectedUserName);
          document.getElementById('ButtonImageSave').style.display="none";
          document.getElementById('ButtonImageCancel').style.display="none";
          description();
        }
    });
    //show the status of whiteboard
     description();

    // Find the canvas element.
    temporaryCanvasObject = document.getElementById('whiteboardPlatform');
    if (!temporaryCanvasObject) {
      $("#snackbar").text("Confirm the canvas element!");
      $("#snackbar").addClass("show");      
      setTimeout(function(){ $("#snackbar").removeClass("show")}, 3000);
      return;
    }
      
    if (!temporaryCanvasObject.getContext) {
      $("#snackbar").text("No canvas.getContext!");
      $("#snackbar").addClass("show");      
      setTimeout(function(){ $("#snackbar").removeClass("show")}, 3000);
      return;
    }

    //get the 2D canvas context.
    canvasContextObject = temporaryCanvasObject.getContext('2d');
    if (!canvasContextObject) {
      $("#snackbar").text("failed to getContext!");
      $("#snackbar").addClass("show");      
      setTimeout(function(){ $("#snackbar").removeClass("show")}, 3000);
      return;
    }
    var container = temporaryCanvasObject.parentNode;
    myCanvasElementObject = document.createElement('canvas');
    if (!myCanvasElementObject) {
      $("#snackbar").text("Cannot create a new canvas element!");
      $("#snackbar").addClass("show");      
      setTimeout(function(){ $("#snackbar").removeClass("show")}, 3000);
     
      return;
    }

    myCanvasElementObject.id = 'canvasTemp';myCanvasElementObject.width  = temporaryCanvasObject.width;myCanvasElementObject.height = temporaryCanvasObject.height;
    
    get2dCanvObject = myCanvasElementObject.getContext('2d');
 
    var tool_select = document.getElementById('pencilDrawingButton'); 
    
    if (canvasDrawToolsSet[defaulTool]) {
      currentPickingTool = new canvasDrawToolsSet[defaulTool]();
      tool_select.value = defaulTool;
    }
    
    function toolButtonClicked(pick){
        if (canvasDrawToolsSet[pick.value]) {
          currentPickingTool = new canvasDrawToolsSet[pick.value]();
        }
    }
       
 
    $("#ButtonRectDrawing").click(function(){
      toolButtonClicked(this)
     })
     $("#pencilDrawingButton").click(function(){
      toolButtonClicked(this)
     });
     $("#ButtonCircleDrawing").click(function(){
        toolButtonClicked(this)
    });
    
    $("#ButtonEllipseDrawing").click(function(){
      toolButtonClicked(this)
     });
     $("#ButtonLineDrawing").click(function(){
      toolButtonClicked(this)
    });  
    
    $("#ButtonTextDrawing").click(function(){
      toolButtonClicked(this)
    });
  
   
     currentPicingFontSize = $("#selectingTextFontSize").val();
    
     $("#selectingTextFontSize").change(function(){
         currentPicingFontSize = $("#selectingTextFontSize").val();
     })
     //currentPicingFontFamily
    currentPicingFontFamily = $("#selectingTextFontFamily").val();
    
    $("#selectingTextFontFamily").change(function(){
        currentPicingFontFamily = $("#selectingTextFontFamily").val();
    })

    currentPicingColor = $("#changeColorToolButton").val();
    
    $("#changeColorToolButton").change(function(){
        currentPicingColor = $("#changeColorToolButton").val();
    });
    currentPicingLineThincness = $("#pickingLinethickness").val();
        
    $("#pickingLinethickness").change(function(){
        currentPicingLineThincness = $("#pickingLinethickness").val();
    });
    
    myCanvasElementObject.addEventListener('mouseup',   canvasPosEvent, false);
    myCanvasElementObject.addEventListener('mousedown', canvasPosEvent, false);
    myCanvasElementObject.addEventListener('mousemove', limitEventCount(canvasPosEvent, 12), false);
  
  }

  //calculation position relative to the myCanvasElementObject element.
  function canvasPosEvent (event) {
      var CanvasPosition = myCanvasElementObject.getBoundingClientRect(); 
    if (event.clientX || v.clientX == 0) { 
      event._x = event.clientX - CanvasPosition.left;
      event._y = event.clientY - CanvasPosition.top;
    } else if (event.offsetX || ev.offsetX == 0) { 
    }
    var func = currentPickingTool[event.type]; if (func) {  func(event);}
    
  }
  
  
  function canvasImgUpdate(trans) {
		canvasContextObject.drawImage(myCanvasElementObject, 0, 0);
		get2dCanvObject.clearRect(0, 0, myCanvasElementObject.width, myCanvasElementObject.height);
        if (!trans) { return; }
          socket.emit("updateCanvasSocket", {  transferCanvas: true });
  }
  function onImageTrans(data){
    canvasImgUpdate();
}
  function limitEventCount(callback, delay) {
    var beforeCallevent,time;
     beforeCallevent = new Date().getTime();
    return function() {
      time = new Date().getTime();

      if ((time - beforeCallevent) >= delay) {
        beforeCallevent = time;  callback.apply(null, arguments);
      }
    };
  }
 

  socket.on("updateCanvasSocket", onImageTrans);

    function ellipseDrawingFunction(x, y, w, h, colorVal, linewidth, emit){
      var kappaConstant = .5522848;
      get2dCanvObject.clearRect(0, 0, myCanvasElementObject.width, myCanvasElementObject.height); 
    var ox, oy, xe, ye, xm, ym;
   
    xm = x + w / 2, ym = y + h / 2;    ox = (w / 2) * kappaConstant,  oy = (h / 2) * kappaConstant, 
      xe = x + w,    ye = y + h,           
 
      get2dCanvObject.beginPath(); get2dCanvObject.moveTo(x, ym);
      get2dCanvObject.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y); get2dCanvObject.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
      get2dCanvObject.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
      get2dCanvObject.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);   get2dCanvObject.closePath();
    
        if(colorVal)
            get2dCanvObject.strokeStyle = "#"+colorVal;
        else
            get2dCanvObject.strokeStyle = "#"+currentPicingColor; 
        if(linewidth)
            get2dCanvObject.lineWidth = linewidth;
        else
            get2dCanvObject.lineWidth = currentPicingLineThincness;  
            get2dCanvObject.stroke();
        
            
            if (!emit) { return; }
            socket.emit("ellipseDrawingSocket", {x: x, y: y,w: w, h: h, colorVal: currentPicingColor, pickingLinethickness: currentPicingLineThincness
            });
    
  }
  
   
    
    function onellipseDrawingFunction(data){
        var width = temporaryCanvasObject.width;
        var height = temporaryCanvasObject.height;
        ellipseDrawingFunction(data.x, data.y, data.w, data.h, data.colorVal, data.pickingLinethickness);
    }
    
    socket.on("ellipseDrawingSocket", onellipseDrawingFunction);


  // The Ellipse tool.
  canvasDrawToolsSet.ellipseDrawing = function () {
    var currentPickingTool = this;
    this.started = false;
    TextAreaTool.style.display = "none";
    TextAreaTool.style.value = "";
    var x,y,w,h;
    this.mouseup = function (e) {
      if (currentPickingTool.started) {
        currentPickingTool.mousemove(e);
        currentPickingTool.started = false;
        canvasImgUpdate(true);

        let data = { x: x, y: y, w: w,h: h,colorVal: currentPicingColor,pickingLinethickness: currentPicingLineThincness}
        console.log("ellipsedraw_mouseUp-----",data)
        let type = "ellipseDrawingSocket";
        let drawingData={};
        drawingData[type]=data;
         socket.emit("allDrawingData", drawingData);
      }
    };
    this.mousedown = function (e) {
      currentPickingTool.started = true;
        currentPickingTool.x0 = e._x;
      currentPickingTool.y0 = e._y;
    };


    this.mousemove = function (event) {
      if (!currentPickingTool.started) {
        return;
      }
     x = Math.min(event._x, currentPickingTool.x0);y = Math.min(event._y, currentPickingTool.y0);
		
		 w = Math.abs(event._x - currentPickingTool.x0); h = Math.abs(event._y - currentPickingTool.y0);
      
        get2dCanvObject.clearRect(0, 0, myCanvasElementObject.width, myCanvasElementObject.height); 
        ellipseDrawingFunction(x, y, w, h, currentPicingColor, currentPicingLineThincness, true);

    };
    
  };
  
  //Rect

  function rectangleDrawingFunction(min_x, min_y, abs_x, abs_y, colorVal, linewidth, emit){
          
            get2dCanvObject.clearRect(0, 0, myCanvasElementObject.width, myCanvasElementObject.height); 
        if(colorVal)
            get2dCanvObject.strokeStyle = "#"+colorVal;
        else
            get2dCanvObject.strokeStyle = "#"+currentPicingColor; 
        if(linewidth)
            get2dCanvObject.lineWidth = linewidth;
        else
            get2dCanvObject.lineWidth = currentPicingLineThincness;
            get2dCanvObject.strokeRect(min_x, min_y, abs_x, abs_y);
            
            if (!emit) { return; }
            var width = temporaryCanvasObject.width;
            var height = temporaryCanvasObject.height;

            socket.emit("rectDrawingSocket", {min_x: min_x / width, min_y: min_y / height, abs_x: abs_x / width, abs_y: abs_y / height,colorVal: currentPicingColor,pickingLinethickness: currentPicingLineThincness
            });
        
    }
    
    function onrectangleDrawingFunction(data){
      var w = temporaryCanvasObject.width;
      var h = temporaryCanvasObject.height;
      rectangleDrawingFunction(data.min_x * w, data.min_y * h, data.abs_x * w, data.abs_y * h, data.colorVal, data.pickingLinethickness);
  }  
    socket.on("rectDrawingSocket", onrectangleDrawingFunction);


  // The rectangle tool.
  canvasDrawToolsSet.rectDrawing = function () {
    var currentPickingTool = this;
    var pos_x, pos_y,pos_w, pos_h
    this.started = false;
    TextAreaTool.style.display = "none";
    TextAreaTool.style.value = "";
   
   //above the tool function

    this.mousedown = function (ev) {
      currentPickingTool.started = true;
      currentPickingTool.x0 = ev._x;
      currentPickingTool.y0 = ev._y;
    };

    this.mousemove = function (e) {
      if (!currentPickingTool.started) {
        return;
      }

          pos_x = Math.min(e._x,  currentPickingTool.x0),
          pos_w = Math.abs(e._x - currentPickingTool.x0),
          pos_y = Math.min(e._y,  currentPickingTool.y0),         
          pos_h = Math.abs(e._y - currentPickingTool.y0);

      get2dCanvObject.clearRect(0, 0, myCanvasElementObject.width, myCanvasElementObject.height); //in rectangleDrawingFunction

      if (!pos_w || !pos_h) {
        return;
      }
        //console.log("emitting")
      rectangleDrawingFunction(pos_x, pos_y, pos_w, pos_h, currentPicingColor, currentPicingLineThincness, true);
      //get2dCanvObject.strokeRect(x, y, w, h); // in rectangleDrawingFunction
    };

    this.mouseup = function (ev) {
      if (currentPickingTool.started) {
        currentPickingTool.mousemove(ev);
        currentPickingTool.started = false;
        canvasImgUpdate(true);
        console.log("onDrawRect_mouseUp-----");
        var w = temporaryCanvasObject.width;
        var h = temporaryCanvasObject.height;
        //let data = {"type":"rectangle","data":{pos_x, pos_y, pos_w, pos_h, currentPicingColor, currentPicingLineThincness}}
        let data = { min_x: pos_x / w, min_y: pos_y / h, abs_x: pos_w / w,abs_y: pos_h / h,colorVal: currentPicingColor,pickingLinethickness: currentPicingLineThincness}
        console.log("onDrawRect_mouseUp-----",data)
        let type = "rectDrawingSocket";
        let drawingData={};
        drawingData[type]=data;
         socket.emit("allDrawingData", drawingData);
      }
    };
  };
  //Lines drawing
   function lineDrawing(x0, y0, x1, y1, colorVal, linewidth, emit){
          get2dCanvObject.clearRect(0, 0, myCanvasElementObject.width, myCanvasElementObject.height); 
          get2dCanvObject.beginPath();
          get2dCanvObject.moveTo(x0, y0);
          get2dCanvObject.lineTo(x1, y1);
          if(colorVal)
            get2dCanvObject.strokeStyle = "#"+colorVal;
        else
            get2dCanvObject.strokeStyle = "#"+currentPicingColor; 
         if(linewidth)
            get2dCanvObject.lineWidth = linewidth;
        else
            get2dCanvObject.lineWidth = currentPicingLineThincness;
            get2dCanvObject.stroke(); get2dCanvObject.closePath();
            if (!emit) { return; }
            var height = temporaryCanvasObject.height;

            var width = temporaryCanvasObject.width;
            
            socket.emit("lineDrawingSocket", {x0: x0 / width,y0: y0 / height, x1: x1 / width,y1: y1 / height,colorVal: currentPicingColor,pickingLinethickness: currentPicingLineThincness
            });
        
    }

  // The line drawing tool.
  canvasDrawToolsSet.lineDrawing = function () {
    var currentPickingTool = this;
    var x1,y1;
    this.started = false;
    TextAreaTool.style.display = "none";
    TextAreaTool.style.value = "";
    this.mousedown = function (ev) {
      currentPickingTool.started = true;
      currentPickingTool.x0 = ev._x; currentPickingTool.y0 = ev._y;
      x1=ev._x; y1=ev._y;
    };

  
    this.mouseup = function (e) {
      if (currentPickingTool.started) {
        currentPickingTool.mousemove(e);
        currentPickingTool.started = false;
        canvasImgUpdate(true);
        var w = temporaryCanvasObject.width;
        var h = temporaryCanvasObject.height;
        let data = { x0: x1/w, y0: y1/h, x1: e._x/w,y1: e._y/h,colorVal: currentPicingColor,pickingLinethickness: currentPicingLineThincness}
        console.log("linedraw_mouseUp-----",data)
        let type = "lineDrawingSocket";  let drawingData={};
         drawingData[type]=data;   socket.emit("allDrawingData", drawingData);
        
      }
    };
    this.mousemove = function (e) {
      if (!currentPickingTool.started) {
        return;
      }
        lineDrawing(currentPickingTool.x0, currentPickingTool.y0, e._x, e._y, currentPicingColor, currentPicingLineThincness, true);

    };

    
  };
  function onLineDrawing(data){
    var width = temporaryCanvasObject.width;
    var height = temporaryCanvasObject.height;
    lineDrawing(data.x0 * width, data.y0 * height, data.x1 * width, data.y1 * height, data.colorVal, data.pickingLinethickness);
}

socket.on("lineDrawingSocket", onLineDrawing);

  // The drawing pencil.
  function penDrawingFunction(x0, y0, x1, y1, colorVal, linewidth, emit){
    get2dCanvObject.beginPath();
    get2dCanvObject.moveTo(x0, y0);
    get2dCanvObject.lineTo(x1, y1);
    if(colorVal)
        get2dCanvObject.strokeStyle = "#"+colorVal;
    else
        get2dCanvObject.strokeStyle = "#"+currentPicingColor; 
    if(linewidth)
        get2dCanvObject.lineWidth = linewidth;
    else
        get2dCanvObject.lineWidth = currentPicingLineThincness;
    get2dCanvObject.stroke();
    get2dCanvObject.closePath();

    if (!emit) { return; }
    var w = temporaryCanvasObject.width;
    var h = temporaryCanvasObject.height;

    socket.emit("penDrawingSocket", {x0: x0 / w,y0: y0 / h,x1: x1 / w,y1: y1 / h, colorVal: currentPicingColor, pickingLinethickness: currentPicingLineThincness});
}
//drawing usein pen
function onpenDrawingFunction(data){
    var width = temporaryCanvasObject.width;
    var height = temporaryCanvasObject.height;
    penDrawingFunction(data.x0 * width, data.y0 * height, data.x1 * width, data.y1 * height, data.colorVal, data.pickingLinethickness);
}

socket.on("penDrawingSocket", onpenDrawingFunction);


canvasDrawToolsSet.pencildrawing = function () {
var currentPickingTool = this;
TextAreaTool.style.value = "";
TextAreaTool.style.display = "none";
this.started = false;

// This is called when you release the mouse button.
this.mouseup = function (ev) {
  if (currentPickingTool.started) {
    currentPickingTool.mousemove(ev);
    currentPickingTool.started = false;
    canvasImgUpdate(true);
  }
};
// starting the pencil drawing.
this.mousedown = function (e) {
    currentPickingTool.started = true; 
    currentPickingTool.y0 = e._y;  currentPickingTool.x0 = e._x;
  
};


this.mousemove = function (ev) {
  if (currentPickingTool.started) {
    penDrawingFunction(currentPickingTool.x0, currentPickingTool.y0, ev._x, ev._y, currentPicingColor, currentPicingLineThincness, true);
    console.log(" onpenDrawingFunction__mouseUp-----");
    var w = temporaryCanvasObject.width; var h = temporaryCanvasObject.height;
    let data = { x0: currentPickingTool.x0 / w, y0:currentPickingTool.y0 / h,  x1:ev._x/ w,y1: ev._y / h,colorVal: currentPicingColor,pickingLinethickness: currentPicingLineThincness}
    console.log(" onpenDrawingFunction_mouseUp-----",data)
    let type = "penDrawingSocket";
    let drawingData={};drawingData[type]=data;
     socket.emit("allDrawingData", drawingData);
    currentPickingTool.x0 = ev._x; currentPickingTool.y0 = ev._y;

  }
};


};
  
  
  
  
 //Text Tool start
 
 TextAreaTool = document.createElement('textarea');
 TextAreaTool.id = 'text_tool';
 TextAreaTool.focus();
 TextAreaTool.className += " form-control";
 container.appendChild(TextAreaTool);
 var tmp_txt_ctn = document.createElement('div');
 container.appendChild(tmp_txt_ctn);tmp_txt_ctn.style.display = 'none';
   
 function textDrawing(fsize, ffamily, colorValue, textPosLeft, textPosTop, processed_lines, emit){
          get2dCanvObject.textBaseline = 'top';
          get2dCanvObject.fillStyle = "#"+colorValue;
          get2dCanvObject.font = fsize + ' ' + ffamily;
          
         for (var n = 0; n < processed_lines.length; n++) {
             var processed_line = processed_lines[n];
              
             get2dCanvObject.fillText(
                 processed_line, parseInt(textPosLeft),
                 parseInt(textPosTop) + n*parseInt(fsize)
             );
         }
         canvasImgUpdate(); //already emitting no need true parameter
         
         if (!emit) { return; }
             socket.emit("textDrawingSocket", {
               fsize: fsize, ffamily: ffamily,
               colorVal: colorValue, textPosLeft: textPosLeft,
               textPosTop: textPosTop,  processed_linesArray: processed_lines 
             });
       
 }

 
 canvasDrawToolsSet.textDrawing = function () {
     var currentPickingTool = this;
     this.started = false;
     TextAreaTool.style.display = "none";
     TextAreaTool.style.value = "";
     this.mouseup = function (e) {
       if (currentPickingTool.started) {
           
             //start      
             var lines = TextAreaTool.value.split('\n');
             var processed_lines = [];
             var left,top;
             for (var i = 0; i < lines.length; i++) {
                 var chars = lines[i].length;
          
                     for (var j = 0; j < chars; j++) {
                         var text_node = document.createTextNode(lines[i][j]);
                         tmp_txt_ctn.appendChild(text_node);  
                         tmp_txt_ctn.style.position   = 'absolute';  tmp_txt_ctn.style.visibility = 'hidden';
                         tmp_txt_ctn.style.display    = 'block';  
                         var width = tmp_txt_ctn.offsetWidth; var height = tmp_txt_ctn.offsetHeight;
                         tmp_txt_ctn.style.visibility = '';
                         tmp_txt_ctn.style.position   = ''; tmp_txt_ctn.style.display    = 'none';
                          
                         if (width > parseInt(TextAreaTool.style.width)) {break;
                         }
                     }
                  
                 processed_lines.push(tmp_txt_ctn.textContent);
                 tmp_txt_ctn.innerHTML = '';
             }
             var ff = currentPicingFontFamily; var fs = currentPicingFontSize + "px";
          
             textDrawing(fs, ff, currentPicingColor, TextAreaTool.style.left, TextAreaTool.style.top, processed_lines, true)
             top= TextAreaTool.style.top; left=  TextAreaTool.style.left;
             console.log("textDrawing"); TextAreaTool.style.display = 'none';
             TextAreaTool.value = '';
                       
         //end
                   
         currentPickingTool.mousemove(e);
         currentPickingTool.started = false;
         let data = { fsize: fs, ffamily: "ff", colorVal: currentPicingColor,textPosLeft: left,textPosTop: top,processed_linesArray: processed_lines}
         console.log("TEXTDRAWING_mouseUp-----",data)
         let type = "textDrawingSocket";
         let drawingData={}; drawingData[type]=data;
          socket.emit("allDrawingData", drawingData);
       }
 };
     this.mousedown = function (e) {
       currentPickingTool.started = true;
       currentPickingTool.y0 = e._y; currentPickingTool.x0 = e._x;
     };
 
     this.mousemove = function (e) {
         if (!currentPickingTool.started) {
         return;
       }
         
         var x = Math.min(e._x, currentPickingTool.x0);
         var y = Math.min(e._y, currentPickingTool.y0);
         var width = Math.abs(e._x - currentPickingTool.x0);
         var height = Math.abs(e._y - currentPickingTool.y0);
         TextAreaTool.style.width = width + 'px';
         TextAreaTool.style.top = y + 'px';  TextAreaTool.style.left = x + 'px';
         TextAreaTool.style.height = height + 'px'; TextAreaTool.style.display = 'block';
         TextAreaTool.style.color = "#"+currentPicingColor;
         TextAreaTool.style.font = currentPicingFontSize+'px' + ' ' + currentPicingFontFamily;
     };
    
   };
   
   function onTextDrawing(data){
    console.log("onTextDrawing");
    var w = temporaryCanvasObject.width;  var h = temporaryCanvasObject.height;
    textDrawing(data.fsize, data.ffamily, data.colorVal, data.textPosLeft, data.textPosTop, data.processed_linesArray);
}

socket.on("textDrawingSocket", onTextDrawing);
  function circleDrawing(x1, y1, x2, y2, colorVal, linewidth, emit){
      
      get2dCanvObject.clearRect(0, 0, myCanvasElementObject.width, myCanvasElementObject.height); 
 
    var x = (x2 + x1) / 2;  var y = (y2 + y1) / 2;
 
    var radius = Math.max(
        Math.abs(x2 - x1),  Math.abs(y2 - y1)
    ) / 2;
 
    get2dCanvObject.beginPath();
    get2dCanvObject.arc(x, y, radius, 0, Math.PI*2, false);
    // get2dCanvObject.arc(x, y, 5, 0, Math.PI*2, false);
     get2dCanvObject.closePath();
        if(colorVal)
            get2dCanvObject.strokeStyle = "#"+colorVal;
        else
            get2dCanvObject.strokeStyle = "#"+currentPicingColor; 
        if(linewidth)
            get2dCanvObject.lineWidth = linewidth;
        else
            get2dCanvObject.lineWidth = currentPicingLineThincness;  
            get2dCanvObject.stroke();     
            if (!emit) { return; }
            var width = temporaryCanvasObject.width;
            var height = temporaryCanvasObject.height;

            socket.emit("circleDrawingSocket", {x1: x1 / width, y1: y1 / height, x2: x2 / width,y2: y2 / height,colorVal: currentPicingColor,pickingLinethickness: currentPicingLineThincness
            });
    
  }
  
   
  // The Circle tool.
  canvasDrawToolsSet.circleDrawing = function () {
    var currentPickingTool = this;
    this.started = false;
    TextAreaTool.style.display = "none";
    TextAreaTool.style.value = "";
    var x1,y1;
    
    this.mousedown = function (e) {
      currentPickingTool.started = true;
      var RECT = myCanvasElementObject.getBoundingClientRect();
      currentPickingTool.x1 = e.clientX - RECT.left;
      currentPickingTool.y1 = e.clientY - RECT.top;
    };

    this.mouseup = function (e) {
      if (currentPickingTool.started) {
        currentPickingTool.mousemove(e);
        currentPickingTool.started = false;
        canvasImgUpdate(true);
        var w = temporaryCanvasObject.width;
        var h = temporaryCanvasObject.height;
        let data = { x1: currentPickingTool.x1/w, y1: currentPickingTool.y1/h, x2: currentPickingTool.x2/w,y2: currentPickingTool.y2/h,colorVal: currentPicingColor,pickingLinethickness: currentPicingLineThincness}
        console.log("CIRCLEDRAWING_mouseUp-----",data)
        let type = "circleDrawingSocket";
        let drawingData={};
         drawingData[type]=data;
         socket.emit("allDrawingData", drawingData);

      }
    };
    this.mousemove = function (e) {
      if (!currentPickingTool.started) {
        return;
      }
      
      var RECT = myCanvasElementObject.getBoundingClientRect();
        currentPickingTool.x2 = e.clientX - RECT.left;
        currentPickingTool.y2 = e.clientY - RECT.top;
    
        get2dCanvObject.clearRect(0, 0, myCanvasElementObject.width, myCanvasElementObject.height); 
        circleDrawing(currentPickingTool.x1, currentPickingTool.y1, currentPickingTool.x2, currentPickingTool.y2, currentPicingColor, currentPicingLineThincness, true);
    
    };

    
  };
    
  socket.on("circleDrawingSocket", onCircleDrawing);
    function onCircleDrawing(data){
        var w = temporaryCanvasObject.width;
        var h = temporaryCanvasObject.height;
        circleDrawing(data.x1 * w, data.y1 * h, data.x2 * w, data.y2 * h, data.colorVal, data.pickingLinethickness);
    }
    


  //canvas clear start
$("#ButtoImageClear").click(function(){
  var myCanvasElementObject_w = myCanvasElementObject.width;
  var myCanvasElementObject_h = myCanvasElementObject.height;
  var temporaryCanvasObject_w = temporaryCanvasObject.width;
  var temporaryCanvasObject_h = temporaryCanvasObject.height;
      get2dCanvObject.clearRect(0, 0, myCanvasElementObject_w, myCanvasElementObject_h);
      canvasContextObject.clearRect(0, 0, temporaryCanvasObject_w, temporaryCanvasObject_h);
      canvasClear(true)
  });
  function canvasClear(trans) {
    var myCanvasElementObject_w = myCanvasElementObject.width;
    var myCanvasElementObject_h = myCanvasElementObject.height;
    var temporaryCanvasObject_w = temporaryCanvasObject.width;
    var temporaryCanvasObject_h = temporaryCanvasObject.height;
    get2dCanvObject.clearRect(0, 0, myCanvasElementObject_w, myCanvasElementObject_h);
    canvasContextObject.clearRect(0, 0, temporaryCanvasObject_w, temporaryCanvasObject_h);
    console.log("deleteCanvasSocket")
        if (!trans) { return; }

        socket.emit("deleteCanvasSocket", {
          CleardrawingBoard: true
        });
  }
  
   function onCanvasClear(data){
            canvasClear();
            console.log("deleteCanvasSocket")
    }
  
  socket.on("deleteCanvasSocket", onCanvasClear);




  init();
  
    

}, false); }

})();


