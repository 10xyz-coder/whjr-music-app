// Setr up ml5.js
const classifier = ml5.imageClassifier('PoseNet', modelReady);
var video;
let poses = {"leftWrist": {"x": 100, "y": 100}, "rightWrist": {"x": 100, "y": 100}, "rightHand": {"x": 100, "y": 100}};
let minion;

let play = document.getElementById('play-btn');
let sw = document.getElementById('swap');
const audio = new Audio('music.mp3');
const audio2 = new Audio('music2.mp3');

let currentAudio = 1;

let change = true;
let lastX, lastY, lastW, lastH;

let vol, sped = 0;

let v = document.getElementById('volume');
let s = document.getElementById('speed');

//let classifier2 = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/xml35JpvC//model.json');

const recognition = new webkitSpeechRecognition();
recognition.continuous = true;

recognition.onresult = (event) => {
  const result = event.results[event.results.length - 1][0].transcript.toLowerCase();
  console.log(result);

  if (['banana', 'stop', 'end', 'white'].includes(result.replace(/\s+/g, ''))) {
    change = false;
  }
};

audio.addEventListener('ended', () => {
  play.classList.remove('disabled')
});
audio2.addEventListener('ended', () => {
  play.classList.remove('disabled')
});


//recognition.start();

play.onclick = () => {
  play.classList.add('disabled');
  //play music.mp3 file
  audio.play();
}

sw.onclick = () => {
  currentAudio = (currentAudio == 1) ? 2 : 1;
  if (currentAudio == 1) {
    audio2.pause();
    audio2.currentTime = 0;
    audio.play();
  } else {
    audio.pause();
    audio.currentTime = 0;
    audio2.play();
  }
}

function modelReady() {
  console.log('model ready');
}

function preload() {
  
 }

// set up p5.js 
function setup() {
  //canvas = createCanvas(640/1.5, 480/1.5);
  //let canvasX = (windowWidth - 680/1.5) / 4;
  //canvas.position(canvasX, 200);

  video = createCapture(VIDEO);
  video.size(640/1.5, 480/1.5)
  let videoX = (windowWidth - 680/1.5) / 4*2;
  video.position(videoX, 200);

  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", gotResult);
}
function draw() {
  //let noseX = poses.nose.x;
  //let noseY = poses.nose.y;
  let LH = 480 - poses.leftWrist.y;
  let RH = 480 - poses.rightWrist.y;
  //let LW = poses.leftWrist.x;
  //let RW = poses.rightWrist.x;

  if (change) {
    //lastX = noseX;
    //lastY = noseY;
    //lastW = Math.max(LW-RW, RW-LW);
    //lastH = Math.max(LH-RH, RH-LH);
  }

  vol = Math.min(LH/300, 1.00);
  sped = Math.min(RH/200, 2.00);

  if (currentAudio == 1) {
    audio.playbackRate = sped;
    audio.volume = vol;
  } else {
    audio2.playbackRate = sped;
    audio2.volume = vol;
  }

  v.innerText = `${vol.toFixed(2)*100}%`;
  s.innerText = `${sped.toFixed(2)*100}%`;

  //console.log(sped, vol)
  
  //image(minion, lastX, lastY, lastW, lastH);
  //rect(50, 50, 50, 50);

  //classifier2.classify(video, gotResult2);
}

function gotResult(results) {
  if (results.length > 0) {
    poses = results[0].pose;
  }
}
function gotResult2(results) {
  if (results.length > 0) {
    res = results[0].label;

    if (res == 'Change') {
      currentAudio = (currentAudio == 1) ? 2 : 1;
    }
  }
}

window.addEventListener('resize', function() {
  //let canvasX = (window.innerWidth - 680/1.5) / 4;
  //canvas.position(canvasX, 200)
  let videoX = (window.innerWidth - 680/1.5) / 4*2;
  video.position(videoX, 200)
});
