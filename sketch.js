let walkingSpriteSheet;

const FRAME_COUNT = 5;     // 一共5幀
const FRAME_WIDTH = 24;    // 120 / 5 = 24
const FRAME_HEIGHT = 16;

let currentFrame = 0;
let frameDelay = 10;       // 幀切換速度
let frameCounter = 0;

let posX, posY;            // 角色座標
let isWalking = false;

let dirX = 1;              // 水平方向：1=右, -1=左, 0=無
let dirY = 0;              // 垂直方向：1=下, -1=上, 0=無

let walkStep = 10;         // 每幀移動距離
let isMirrored = false;    // 是否左右翻轉

function preload() {
  walkingSpriteSheet = loadImage('1/44.png');  // 確認圖片路徑正確
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  posX = width / 2;
  posY = height / 2;
  imageMode(CORNER);
  noSmooth();
}

function draw() {
  background('#CEFFCE');

  if (isWalking) {
    frameCounter++;
    if (frameCounter >= frameDelay) {
      frameCounter = 0;

      // 換下一幀
      currentFrame = (currentFrame + 1) % FRAME_COUNT;

      // 每幀移動
      posX += dirX * walkStep;
      posY += dirY * walkStep;

      // 邊界限制，卡在邊界不會回退
      posX = constrain(posX, 0, width - FRAME_WIDTH * 6);
      posY = constrain(posY, 0, height - FRAME_HEIGHT * 6);
    }
  }

  // 只在水平方向有改變時更新左右翻轉
  // 垂直方向不會改變原本水平朝向
  // 當 dirX != 0 時更新，dirX == 0 時保留原來值
  // 這樣按上下箭頭時人物保持原本左右朝向
  drawSprite();
}

function drawSprite() {
  let sx = currentFrame * FRAME_WIDTH;
  let sy = 0;
  let sw = FRAME_WIDTH;
  let sh = FRAME_HEIGHT;

  let scaleFactor = 6;
  let dw = sw * scaleFactor;
  let dh = sh * scaleFactor;

  let dx = posX;
  let dy = posY;

  push();
  if (isMirrored) {
    translate(dx + dw, dy);
    scale(-1, 1);
    image(walkingSpriteSheet, 0, 0, dw, dh, sx, sy, sw, sh);
  } else {
    image(walkingSpriteSheet, dx, dy, dw, dh, sx, sy, sw, sh);
  }
  pop();
}

// 按左鍵開始走路
function mousePressed() {
  if (mouseButton === LEFT) {
    isWalking = true;
  }
}

// 鍵盤控制方向
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    dirX = -1; dirY = 0;
    isMirrored = true;  // 左走時翻轉
  } else if (keyCode === RIGHT_ARROW) {
    dirX = 1; dirY = 0;
    isMirrored = false; // 右走時正常
  } else if (keyCode === UP_ARROW) {
    dirX = dirX; dirY = -1; // 垂直走時保持水平朝向不變
  } else if (keyCode === DOWN_ARROW) {
    dirX = dirX; dirY = 1;  // 垂直走時保持水平朝向不變
  }
}

// 畫布全螢幕自動調整
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}