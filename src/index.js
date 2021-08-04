import * as mask from './prediction'
import * as utils from './utils'
import * as tf from '@tensorflow/tfjs';
import * as faceapi from 'face-api.js';
//import * as faceapi from '@vladmandic/face-api/dist/face-api.esm.js';

let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let status = document.getElementById("status");
let model;

function setupCamera() {
  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: { width: 600, height: 400 },
    })
    .then((stream) => {
      // stream is a MediaStream object
      video.srcObject = stream;
    });
};

setupCamera();

video.addEventListener('loadeddata', async () => {
  status.innerText = "loading models..."
  
  //await faceapi.loadSsdMobilenetv1Model('/models')
  await faceapi.loadTinyFaceDetectorModel('/models')

  model = await mask.loadMaskModel()
  status.innerText = 'model loaded'

  gameLoop();
});

let secondsLeft;
let lastTimestmap;
let fps;

const LABELS = ['With Mask', 'Without Mask']

async function gameLoop() {
  do {
    // calculate fps
    let current = performance.now()
    secondsLeft = (current - lastTimestmap) / 1000;
    lastTimestmap = current;
    fps = Math.round(1 / secondsLeft);

    let detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
    // filter detections by confidence value
    // extract faces using faceapi
    let faces = await faceapi.extractFaces(video, detections)
    //renderDetections(video, detections);

    ctx.drawImage(video, 0, 0, 600, 400);

    if (faces.length > 0) {
      let predictions = await mask.predict(model, faces[0])
      console.log(predictions)
      let label_pred = LABELS[utils.arrayMaxIndex(predictions)]
      let box = detections[0].box
      let box_pred = new faceapi.draw.DrawBox(box, { label: label_pred, lineWidth: 2 })
      box_pred.draw(canvas)
    }
    
    //faceapi.draw.drawDetections(canvas, detections);
    ctx.font = '25px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`FPS: ${fps}`, 10, 30);

    await new Promise(window.requestAnimationFrame);

  } while(true)
}

function renderDetections(video, detections) {
  // clear canvas
  ctx.drawImage(video, 0, 0, 600, 400);
  faceapi.draw.drawDetections(canvas, detections);
}