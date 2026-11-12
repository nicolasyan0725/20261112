let walkSheet;
let idleSheet;

let totalWidth = 1246;
let totalHeight = 196;
let totalFrames = 9;
let frameWidth; 

let currentFrame = 0;

let charX;
let charY;
let speed = 10;

// --- 新增跳躍與重力所需的變數 ---
let velocityY = 0;     // 垂直方向的速度
let gravity = 2;       // 重力加速度 (數字越大落得越快)
let jumpStrength = -30; // 跳躍力量 (因為畫布 Y 軸越往下越大，所以往上跳要是負值)
let groundY;           // 紀錄地面的 Y 座標
let isJumping = false; // 判斷角色是否在空中，防止連續二段跳

let isWalking = false;
let facingRight = true;

function preload() {
  walkSheet = loadImage('1/walk/27e1d652-1fa6-4efc-ae32-eac4454f3ebe.png');
  idleSheet = loadImage('1/stop/a36a3dab-5b84-4feb-9a68-c7f18a78f055.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(10);
  
  frameWidth = totalWidth / totalFrames;
  
  // 計算並設定地面高度
  groundY = height - totalHeight;
  
  charX = width / 3;
  // 將角色的初始 Y 座標設定在地面
  charY = groundY;
}

function draw() {
  background(135, 206, 235);

  isWalking = false;

  // 左右移動判定 (即使在空中也可以移動)
  if (keyIsDown(RIGHT_ARROW)) {
    charX += speed;
    isWalking = true;
    facingRight = true;
  } else if (keyIsDown(LEFT_ARROW)) {
    charX -= speed;
    isWalking = true;
    facingRight = false;
  }

  // --- 跳躍觸發判定 ---
  // 當按下向上鍵 (UP_ARROW)，且角色「不在空中」(!isJumping) 時，賦予向上的速度
  if (keyIsDown(UP_ARROW) && !isJumping) {
    velocityY = jumpStrength;
    isJumping = true; // 狀態標記為正在跳躍
  }

  // --- 物理與重力計算 ---
  velocityY += gravity; // 速度受到重力影響，會不斷增加 (往下掉)
  charY += velocityY;   // 將計算後的垂直速度應用到角色的 Y 座標上

  // --- 地面碰撞偵測 ---
  // 如果角色的 Y 座標超過了地面，強制把他拉回地面上
  if (charY >= groundY) {
    charY = groundY;    // 鎖定在地面高度
    velocityY = 0;      // 垂直速度歸零
    isJumping = false;  // 著陸，解除跳躍狀態，允許再次跳躍
  }

  let sx = currentFrame * frameWidth;
  let sy = 0;
  let currentSheet = isWalking ? walkSheet : idleSheet;

  let singleFrame = currentSheet.get(floor(sx), sy, floor(frameWidth), totalHeight);

  push();
  
  if (facingRight) {
    image(singleFrame, charX, charY);
  } else {
    translate(charX + frameWidth, charY);
    scale(-1, 1);
    image(singleFrame, 0, 0);
  }
  
  pop();

  // --- 動畫幀數更新邏輯 ---
  // 如果在走路「且不在空中」才播放動畫；如果跳起來了，將動作凍結在第 0 幀避免空中踏步
  if (isWalking && !isJumping) {
    currentFrame = (currentFrame + 1) % totalFrames;
  } else {
    currentFrame = 0; 
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 視窗縮放時重新計算地面高度
  groundY = height - totalHeight;
  // 如果角色沒有在跳躍，將他對齊新的地面
  if (!isJumping) {
    charY = groundY;
  }
}