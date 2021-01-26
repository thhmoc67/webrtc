import React, { useEffect } from "react";
import logo from "../logo.png";

function CanvasDraw() {
  let arena = {
    canvas: null,
    canvasOverlay: null,
    ctx: null,
    flag: false,
    prevX: 0,
    currX: 0,
    prevY: 0,
    currY: 0,
    dot_flag: false,
    moveFlag: false,

    y: 2,
    canvasWidth: 0,
    canvasHeight: 0,

    textX: 0,
    textY: 0,
  };

  function initCanvas() {
    arena.canvas = document.getElementById("canvas-draw");
    arena.ctx = arena.canvas.getContext("2d");
    arena.canvasWidth = arena.canvas.width;
    arena.canvasHeight = arena.canvas.height;
  }

  function handleMouseDown(e) {
    initCanvas();
    arena.currX = 0;
    arena.currY = 0;
    arena.prevX = 0;
    arena.prevY = 0;
    arena.ctx.globalCompositeOperation = "source-over";
    arena.flag = true;
    arena.dot_flag = true;

    arena.prevX = arena.currX;
    arena.prevY = arena.currY;
    arena.currX = e.pageX - arena.canvas.offsetLeft;
    arena.currY = e.pageY - arena.canvas.offsetTop;
  }

  function handleMouseMove(e) {
    initCanvas();
    if (arena.flag) {
      arena.moveFlag = true;
      arena.ctx.strokeStyle = "#000";
      arena.ctx.lineWidth = arena.y;
      // ctx.lineWidth = 20;

      arena.prevX = arena.currX;
      arena.prevY = arena.currY;
      arena.currX = e.pageX - arena.canvas.offsetLeft;
      arena.currY = e.pageY - arena.canvas.offsetTop;
      arena.ctx.beginPath();
      arena.ctx.moveTo(arena.prevX, arena.prevY);
      arena.ctx.lineTo(arena.currX, arena.currY);
      arena.ctx.stroke();
      arena.ctx.closePath();
    }
  }

  function handleMouseUp(e) {
    initCanvas();
    if (arena.flag && arena.moveFlag) {
      arena.flag = false;
      arena.moveFlag = false;
      arena.ctx.closePath();
    }
  }

  function handleMouseOut(arena, init) {
    arena.flag = false;
  }

  useEffect(() => {
    let canvas = document.getElementById("canvas");

    let vid = document.getElementById("localVideo");
    let image = new Image();
    image.src = logo;

    function draw() {
      let canvas = document.getElementById("canvas");
      let canvasDrawed = document.getElementById("canvas-draw");

      if (canvas.getContext) {
        let ctx = canvas.getContext("2d");

        ctx.drawImage(canvasDrawed, 0, 0, 400, 400);
        ctx.drawImage(image, 20, 10, 50, 14);
        ctx.drawImage(vid, 250, 280, 120, 80);
      }
    }

    //update canvas for every 25ms

    setInterval(function () {
      draw();
    }, 25);

    //capture stream from canvas

    //get audio with getUserMedia

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(function (stream) {
        var video = document.querySelector("video#localVideo");

        video.srcObject = stream;

        video.onloadedmetadata = function (e) {
          video.play();
        };

        var localStream = canvas.captureStream(25);
        // localStream.addTrack(stream.getAudioTracks()[0]);
        if (localStream) {
          let localStreamVideo = document.querySelector(
            "video#localCanvastream"
          );
          localStreamVideo.srcObject = localStream;
        }
        //initialize the webRTCAdaptor with the localStream created.

        //initWebRTCAdaptor method is implemented below

        // initWebRTCAdaptor(localStream);
      });
  }, []);

  return (
    <div>
      <p>
        <video
          style={{ display: "none" }}
          id="localVideo"
          autoPlay
          muted
          controls={false}
          playsInline
        ></video>
      </p>

      <canvas
        id={"canvas-draw"}
        width={"400"}
        height={"400"}
        style={{ border: "1px solid #eee", background: "#fff" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseOut}
      ></canvas>
      <canvas
        id="canvas"
        width="400"
        height="400"
        style={{ border: "1px solid #eee" }}
      ></canvas>

      <video
        id="localCanvastream"
        autoPlay
        controls
        playsInline
      ></video>
    </div>
  );
}

export default CanvasDraw;
