// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let poseNet;
let poses = [];
let isPlaying = [];
let song=[];
let img=[];
const squareSize = 100;
let rects=[];

function preload() {
  song[0] = loadSound('harp.wav');
  song[1] = loadSound('female.wav');
  song[2] = loadSound('drumroll.wav');
  song[3] = loadSound('tympani.wav');
  song[4] = loadSound('tap.wav');
  img[0] = loadImage('assets/harp.jpg')
  img[1] = loadImage('assets/female.png')
  img[2] = loadImage('assets/drumroll.jpeg')
  img[3] = loadImage('assets/tympani.jpg')
  img[4] = loadImage('assets/tap.jpeg')
}

function setup() {
  createCanvas(640, 480);
  for(let i=0;i<5;i++){
    isPlaying[i]=false;
  }
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, 'single', modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  select('#status').html('Model Loaded');
}


function draw() {
  // Flip the video from left to right, mirror the video
  translate(width, 0)
  scale(-1, 1);
  image(video, 0, 0, width, height);

  for(let i=0;i<5;i++){
    if (isPlaying[i]) {
      fill(0, 255, 100, 50);
    if (!song[i].isPlaying()) {
      song[i].play();
    }
  } else {
    fill(255, 0, 100,50);
    // .isPaused()() returns a boolean
    // If the song is not paused, pause the song
    if (!song[i].isPaused()) {
      song[i].pause();
    }
  }
  }
  noStroke();
  rects[0]=rect(width / 2 - squareSize / 2, height / 2 - squareSize / 2, squareSize, squareSize);
  rects[1]=rect(0,0, squareSize, squareSize);
  rects[2]=rect(0,height - squareSize, squareSize, squareSize);
  rects[3]=rect(width - squareSize, 0, squareSize, squareSize);
  rects[4]=rect(width - squareSize, height - squareSize, squareSize, squareSize);

  image(img[0], width / 2 - squareSize / 2, height / 2 - squareSize / 2, squareSize, squareSize);
  image(img[1], 0, 0, squareSize, squareSize);
  image(img[2],0,height - squareSize, squareSize, squareSize);
  image(img[3], width - squareSize, 0, squareSize, squareSize);
  image(img[4],width - squareSize, height - squareSize, squareSize, squareSize);
  
  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(0, 0, 255);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
      // keypoint[0] is the nose point
      // Only check the first pose
      if (i === 0 && j === 0) {
        ellipse(keypoint.position.x, keypoint.position.y, 30, 30);
        checkIfPlay0(keypoint.position);
        checkIfPlay1(keypoint.position);
        checkIfPlay2(keypoint.position);
        checkIfPlay3(keypoint.position);
        checkIfPlay4(keypoint.position);
      }
    }
  }
}

function checkIfPlay0(position) {
  const halfSize = squareSize / 2;
  // Check if the position is inside of the square
  if (position.x >= width / 2 - halfSize && position.x <= width / 2 + halfSize &&
      position.y >= height / 2 - halfSize && position.y <= height / 2 + halfSize
  ) {
    isPlaying[0] = true;
  } else {
    isPlaying[0] = false;
  }
}

function checkIfPlay1(position) {
  // Check if the position is inside of the square
  if (position.x <= squareSize && position.x >= 0 &&
      position.y <= squareSize && position.y >= 0
  ) {
    isPlaying[1] = true;
  } else {
    isPlaying[1] = false;
  }
}

function checkIfPlay2(position) {
  // Check if the position is inside of the square
  if (position.x >= width - squareSize && position.x <= width &&
      position.y <= squareSize && position.y >= 0
  ) {
    isPlaying[2] = true;
  } else {
    isPlaying[2] = false;
  }
}

function checkIfPlay3(position) {
  // Check if the position is inside of the square
  if (position.x <= squareSize && position.x >= 0 &&
      position.y >= height - squareSize && position.y <= height
  ) {
    isPlaying[3] = true;
  } else {
    isPlaying[3] = false;
  }
}

function checkIfPlay4(position) {
  // Check if the position is inside of the square
  if (position.x >= width - squareSize && position.x <= width &&
      position.y >= height - squareSize && position.y <= height
  ) {
    isPlaying[4] = true;
  } else {
    isPlaying[4] = false;
  }
}





// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(0, 0, 255);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}