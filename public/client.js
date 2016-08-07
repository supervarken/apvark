 var socket  = io.connect();
document.addEventListener("DOMContentLoaded", function() {
   var mouse = {
      click: false,
      move: false,
      pos: {x:0, y:0},
      pos_prev: false,
      colour: "blue"

   };
   var touch = is_touch_device();

   var canvas  = document.getElementById('drawing');

   var ctx = canvas.getContext('2d');
   var width = document.body.clientWidth;

var height = document.body.clientHeight;

   canvas.width = width;
   canvas.height = height;

   canvas.onmousedown = function(e){ mouse.click = true; };
   canvas.onmouseup = function(e){ mouse.click = false; };
   canvas.ontouchstart = function(e){ mouse.click = true;mouse.pos_prev.x = e.touches[0].clientX / width;mouse.pos_prev.y = e.touches[0].clientY / height;};
   canvas.ontouchend = function(e){ mouse.click = false; };

   canvas.onmousemove = function(e) {
      mouse.pos.x = e.clientX / width;
      mouse.pos.y = e.clientY / height;
      mouse.pos.w = document.getElementById("rag").value;
      mouse.move = true;
   };
    canvas.ontouchmove = function(e) {
      mouse.pos.x = e.touches[0].clientX / width;
      mouse.pos.y = e.touches[0].clientY / height;
      mouse.pos.w = document.getElementById("rag").value;
      mouse.move = true;
   };

	socket.on('draw_line', function (data) {
      var line = data.line;

      ctx.strokeStyle = line[2];
      ctx.lineWidth = line[0].w;
      ctx.beginPath();
      ctx.moveTo(line[0].x * width, line[0].y * height);
      ctx.lineTo(line[1].x * width, line[1].y * height);
      ctx.stroke();

   });
    socket.on('clear', function () {
    ctx.clearRect(0,0,width,height);

   });

   function mainLoop() {

      if (mouse.click && mouse.move && mouse.pos_prev) {

         mouse.colour = document.getElementById("col").value;
         socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev, mouse.colour]});
         mouse.move = false;
         if (touch){
             mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
         }
     }

        mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};

      setTimeout(mainLoop, 10);

   }

      mainLoop();

});

function delet(){
if(confirm('Are you sure you want to delete everything drawn?')){
  socket.emit('clear_all');
    }
}

function is_touch_device() {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
}
