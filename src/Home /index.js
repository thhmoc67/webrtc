import React, { useEffect } from "react";
import logo from "../logo.png";

function Home() {
  useEffect(() => {
    let canvas = document.getElementById("canvas");

    let vid = document.getElementById("localVideo");
    let image = new Image();
    image.src = logo;

    function draw() {
      let canvas = document.getElementById("canvas");

      if (canvas.getContext) {
        let ctx = canvas.getContext("2d");

        ctx.drawImage(vid, 0, 0, 400, 250);
        ctx.drawImage(image, 20, 10, 50, 14);
        ctx.drawImage(vid, 280, 180, 100, 60);
      }
    }

    //update canvas for every 25ms

    setInterval(function () {
      draw();
    }, 25);

    //capture stream from canvas

    var localStream = canvas.captureStream(25);

    //get audio with getUserMedia

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(function (stream) {
        var video = document.querySelector("video#localVideo");

        video.srcObject = stream;

        video.onloadedmetadata = function (e) {
          video.play();
        };

        //initialize the webRTCAdaptor with the localStream created.

        //initWebRTCAdaptor method is implemented below

        // initWebRTCAdaptor(localStream);
      });
  }, []);

  return (
    <div>
      <canvas id="canvas" width="400" height="250"></canvas>
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
    </div>
  );
}

export default Home;
