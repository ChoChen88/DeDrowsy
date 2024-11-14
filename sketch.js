let cam;
let isActive = false;
let lastTime = 0;
let sound;
let recordSound;

function preload() {
  sound = loadSound("1010.MP3");
  //recordSound = loadSound("001.m4a");
}

function setup() {
  createCanvas(640, 480);
  cam = createCapture(VIDEO, function () {
    update();
  });
  cam.hide();

  imageMode(CENTER);
  rectMode(CENTER);
}

function draw() {
  background(255);

  imageMode(CORNER);
  image(cam, 0, 0);
  if (faces != undefined) {
    if (
      faces.multiFaceLandmarks != undefined &&
      faces.multiFaceLandmarks.length >= 1
    ) {
      drawFaceMesh();
      let face = getFaceLandmarks();

      // fill(255, 100);
      // // face.mouth
      // rect(face.mouth.x, face.mouth.y, face.mouth.width, face.mouth.height);
      // //  face.nose
      // rect(face.nose.x, face.nose.y, face.nose.width, face.nose.height);
      // //  face.r_eye
      // rect(face.r_eye.x, face.r_eye.y, face.r_eye.width, face.r_eye.height);
      // //  face.l_eye
      // rect(face.l_eye.x, face.l_eye.y, face.l_eye.width, face.l_eye.height);

      // isActive
      isActive = face.mouth.height >= face.mouth.width / 1.5;
    }
  }

  textSize(48);
  fill(255, 25, 5);
  text(isActive ? "Yawning" : "", 16, 48);

  if (isActive && millis() - lastTime > 2300 && !sound.isPlaying()) {
    lastTime = millis();
    sound.play();
  }
}

/* jshint esversion: 8 */
let faces = {};

const faceMesh = new FaceMesh({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
  },
});

faceMesh.setOptions({
  maxNumFaces: 2,
  refineLandmarks: true,
  minDetectionConfidence: 0.8,
  minTrackingConfidence: 0.5,
});

faceMesh.onResults(gotFaces);

function gotFaces(results) {
  faces = results;
}

function update() {
  window.requestAnimationFrame(send);
}

async function send() {
  await faceMesh.send({ image: cam.elt }).then(function () {
    update();
  });
}

function getFaceLandmarks() {
  let f = faces.multiFaceLandmarks[0];
  face = getSize2(f[234], f[454], f[10], f[152]);
  //mouthLoc = getLocation(f[78], f[308]);
  mouth = getSize2(f[78], f[308], f[13], f[14]);
  //rightEyeLoc = getLocation(f[246], f[173]);
  rightEye = getSize(f[246], f[173], f[159], f[145]);
  //leftEyeLoc = getLocation(f[466], f[398]);
  leftEye = getSize(f[466], f[398], f[386], f[374]);
  nose = {
    x: f[1].x * width,
    y: f[1].y * height,
    width: face.width / 6,
    height: face.height / 4,
  };
  //noseSize = { width: 30, height: 5 };
  //faceLoc = getLocation(f[10], f[152]);

  faceAngle = atan2(f[234].y - f[454].y, f[234].x - f[454].x) - PI;
  return {
    mouth: mouth,
    r_eye: rightEye,
    l_eye: leftEye,
    nose: nose,
    box: face,
    angle: faceAngle,
  };
}

function getLocation(a, b) {
  return { x: ((a.x + b.x) / 2) * width, y: ((a.y + b.y) / 2) * height };
}

function getSize(a, b, c, d) {
  let x = ((a.x + b.x) / 2) * width;
  let y = ((a.y + b.y) / 2) * height;
  let w = abs(b.x - a.x) * width;
  let h = abs(d.y - c.y) * height;
  return { x: x, y: y, width: w, height: h };
}

function getSize2(a, b, c, d) {
  let x = ((c.x + d.x) / 2) * width;
  let y = ((c.y + d.y) / 2) * height;
  let w = abs(b.x - a.x) * width;
  let h = abs(d.y - c.y) * height;
  return { x: x, y: y, width: w, height: h };
}

function drawFaceLandmark() {
  strokeWeight(3);
  for (let j = 0; j < FACEMESH_FACE_OVAL.length; j++) {
    let index = FACEMESH_FACE_OVAL[j][0];
    let x = faces.multiFaceLandmarks[0][index].x * width;
    let y = faces.multiFaceLandmarks[0][index].y * height;
    point(x, y);
  }
  for (let j = 0; j < MESH_ANNOTATIONS.lipsUpperInner.length; j++) {
    let index = MESH_ANNOTATIONS.lipsUpperInner[j];
    let x = faces.multiFaceLandmarks[0][index].x * width;
    let y = faces.multiFaceLandmarks[0][index].y * height;
    point(x, y);
  }
  for (let j = 0; j < MESH_ANNOTATIONS.lipsLowerInner.length; j++) {
    let index = MESH_ANNOTATIONS.lipsLowerInner[j];
    let x = faces.multiFaceLandmarks[0][index].x * width;
    let y = faces.multiFaceLandmarks[0][index].y * height;
    point(x, y);
  }
  for (let j = 0; j < MESH_ANNOTATIONS.rightEyeUpper2.length; j++) {
    let index = MESH_ANNOTATIONS.rightEyeUpper0[j];
    let x = faces.multiFaceLandmarks[0][index].x * width;
    let y = faces.multiFaceLandmarks[0][index].y * height;
    point(x, y);
  }
  for (let j = 0; j < MESH_ANNOTATIONS.rightEyeLower2.length; j++) {
    let index = MESH_ANNOTATIONS.rightEyeLower0[j];
    let x = faces.multiFaceLandmarks[0][index].x * width;
    let y = faces.multiFaceLandmarks[0][index].y * height;
    point(x, y);
  }
  for (let j = 0; j < MESH_ANNOTATIONS.leftEyeUpper2.length; j++) {
    let index = MESH_ANNOTATIONS.leftEyeUpper0[j];
    let x = faces.multiFaceLandmarks[0][index].x * width;
    let y = faces.multiFaceLandmarks[0][index].y * height;
    point(x, y);
  }
  for (let j = 0; j < MESH_ANNOTATIONS.leftEyeLower2.length; j++) {
    let index = MESH_ANNOTATIONS.leftEyeLower0[j];
    let x = faces.multiFaceLandmarks[0][index].x * width;
    let y = faces.multiFaceLandmarks[0][index].y * height;
    point(x, y);
  }
  let index = MESH_ANNOTATIONS.noseTip[0];
  let x = faces.multiFaceLandmarks[0][index].x * width;
  let y = faces.multiFaceLandmarks[0][index].y * height;
  point(x, y);
  index = MESH_ANNOTATIONS.noseBottom[0];
  x = faces.multiFaceLandmarks[0][index].x * width;
  y = faces.multiFaceLandmarks[0][index].y * height;
  point(x, y);
  index = MESH_ANNOTATIONS.noseRightCorner[0];
  x = faces.multiFaceLandmarks[0][index].x * width;
  y = faces.multiFaceLandmarks[0][index].y * height;
  point(x, y);
  index = MESH_ANNOTATIONS.noseLeftCorner[0];
  x = faces.multiFaceLandmarks[0][index].x * width;
  y = faces.multiFaceLandmarks[0][index].y * height;
  point(x, y);
  index = 6;
  x = faces.multiFaceLandmarks[0][index].x * width;
  y = faces.multiFaceLandmarks[0][index].y * height;
  point(x, y);
}

function drawFacePoint() {
  strokeWeight(3);
  beginShape(POINTS);
  for (let j = 0; j < faces.multiFaceLandmarks[0].length; j++) {
    let x = faces.multiFaceLandmarks[0][j].x * width;
    let y = faces.multiFaceLandmarks[0][j].y * height;
    vertex(x, y);
  }
  endShape();
}

function drawFaceMesh() {
  noFill();

  for (let i = 0; i < FACEMESH_TESSELATION.length; i += 3) {
    let points = [
      FACEMESH_TESSELATION[i][0],
      FACEMESH_TESSELATION[i + 1][0],
      FACEMESH_TESSELATION[i + 2][0],
    ].map((index) => faces.multiFaceLandmarks[0][index]);
    beginShape();
    vertex(points[0].x * width, points[0].y * height);
    vertex(points[1].x * width, points[1].y * height);
    vertex(points[2].x * width, points[2].y * height);
    endShape(CLOSE);
  }
}

const MESH_ANNOTATIONS = {
  silhouette: [
    10,
    338,
    297,
    332,
    284,
    251,
    389,
    356,
    454,
    323,
    361,
    288,
    397,
    365,
    379,
    378,
    400,
    377,
    152,
    148,
    176,
    149,
    150,
    136,
    172,
    58,
    132,
    93,
    234,
    127,
    162,
    21,
    54,
    103,
    67,
    109,
  ],

  lipsUpperOuter: [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291],
  lipsLowerOuter: [146, 91, 181, 84, 17, 314, 405, 321, 375, 291],
  lipsUpperInner: [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308],
  lipsLowerInner: [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308],

  rightEyeUpper0: [246, 161, 160, 159, 158, 157, 173],
  rightEyeLower0: [33, 7, 163, 144, 145, 153, 154, 155, 133],
  rightEyeUpper1: [247, 30, 29, 27, 28, 56, 190],
  rightEyeLower1: [130, 25, 110, 24, 23, 22, 26, 112, 243],
  rightEyeUpper2: [113, 225, 224, 223, 222, 221, 189],
  rightEyeLower2: [226, 31, 228, 229, 230, 231, 232, 233, 244],
  rightEyeLower3: [143, 111, 117, 118, 119, 120, 121, 128, 245],

  rightEyebrowUpper: [156, 70, 63, 105, 66, 107, 55, 193],
  rightEyebrowLower: [35, 124, 46, 53, 52, 65],

  rightEyeIris: [473, 474, 475, 476, 477],

  leftEyeUpper0: [466, 388, 387, 386, 385, 384, 398],
  leftEyeLower0: [263, 249, 390, 373, 374, 380, 381, 382, 362],
  leftEyeUpper1: [467, 260, 259, 257, 258, 286, 414],
  leftEyeLower1: [359, 255, 339, 254, 253, 252, 256, 341, 463],
  leftEyeUpper2: [342, 445, 444, 443, 442, 441, 413],
  leftEyeLower2: [446, 261, 448, 449, 450, 451, 452, 453, 464],
  leftEyeLower3: [372, 340, 346, 347, 348, 349, 350, 357, 465],

  leftEyebrowUpper: [383, 300, 293, 334, 296, 336, 285, 417],
  leftEyebrowLower: [265, 353, 276, 283, 282, 295],

  leftEyeIris: [468, 469, 470, 471, 472],

  midwayBetweenEyes: [168],

  noseTip: [1],
  noseBottom: [2],
  noseRightCorner: [98],
  noseLeftCorner: [327],

  rightCheek: [205],
  leftCheek: [425],
};


