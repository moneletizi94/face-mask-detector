import * as mask from './prediction'
import * as utils from './utils'
import * as tf from '@tensorflow/tfjs';
//import * as faceapi from '@vladmandic/face-api/dist/face-api.esm.js';

let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
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
  console.log('loading models...')
  //await faceapi.loadSsdMobilenetv1Model('/models')
  model = await mask.loadMaskModel()
  console.log('loaded')

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

    //let detections = await faceapi.detectAllFaces(video);
    //console.log(detections);

    //renderDetections(video, detections);
    let pred = await mask.predict(model, video)
    let label = LABELS[utils.arrayMaxIndex(pred)]

    ctx.drawImage(video, 0, 0, 600, 400);
    ctx.font = '25px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`FPS: ${fps}, ${label}`, 10, 30);

    await new Promise(window.requestAnimationFrame);

  } while(true)
}

function renderDetections(video, detections) {
  // clear canvas
  ctx.drawImage(video, 0, 0, 600, 400);
  faceapi.draw.drawDetections(canvas, detections);
}