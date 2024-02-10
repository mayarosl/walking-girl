// npm run dev
import './style.css'

import { loadImage } from './utils/loadImage';
import { calculateTileCoordinate } from './utils/calculateTileCoordinates';

import HAGESHI_WALK from './assets/HAGESHI_WALK.png';
import terrianPath from './assets/durotar.png';
import mapJSON from './assets/map.json'

const canvas = document.getElementById('game') as HTMLCanvasElement | null;

if (!canvas) throw new Error('Canvas not found')

// количество кадров
const shots = 3;

let keyPress = false;
let direction = 0;

// стартовая точка персонажа
let characterX = 100;
let characterY = 300;
let step = 0;

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const COL_LENGTH = 30;
const ROW_LENGTH = 20;
const CELL_SIZE = 32;
const MAX_PLAYER_X = COL_LENGTH * CELL_SIZE;
const MAX_PLAYER_Y = ROW_LENGTH * CELL_SIZE;

const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const camera = {
  x: 0,
  y: 0
}

function updateCamera() {
  const halfWidth = CANVAS_WIDTH / 2;
  const halfHeight = CANVAS_HEIGHT / 2;

  // по умолчанию
  // characterX - halfWidth = -300
  // MAX_PLAYER_X = 960
  camera.x = Math.max(0, Math.min(characterX - halfWidth, MAX_PLAYER_X - halfWidth))
  camera.y = Math.max(0, Math.min(characterY - halfHeight, MAX_PLAYER_Y - halfHeight))

  if (camera.x >= MAX_PLAYER_X - CANVAS_WIDTH) {
    camera.x = MAX_PLAYER_X - CANVAS_WIDTH;
  }

  if (camera.y >= MAX_PLAYER_Y - CANVAS_HEIGHT) {
    camera.y = MAX_PLAYER_Y - CANVAS_HEIGHT;
  }
}

function loadSprites() {
  return Promise.all([
    loadImage(HAGESHI_WALK),
    loadImage(terrianPath)
  ]);
}

const mapImg = new Image();
mapImg.src = terrianPath;

const characterImg = new Image();
characterImg.src = HAGESHI_WALK;

loadSprites().then(() => {
  let lastTimeUpdate = 0;

  function animate(timestamp: number) {
    const deltaTime = timestamp - lastTimeUpdate;

    updateCamera();
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawGame(0);
    drawCharacter(deltaTime);
    // drawGame(1);

    lastTimeUpdate = timestamp;
    window.requestAnimationFrame(animate);
  };

  window.requestAnimationFrame(animate)
})

function drawGame(layer = 0) {
  const { layers } = mapJSON;
  const { data } = layers[layer];

  for (let cell = 0; cell < data.length; cell++) {
    const col = cell % COL_LENGTH;
    const row = Math.floor(cell / COL_LENGTH);
    const tileNumber = data[cell];
    const { x, y } = calculateTileCoordinate({
      tileNumber: tileNumber - 1,
      width: CELL_SIZE,
      height: CELL_SIZE,
      columns: 19,
      pixelGap: 1
    });
    ctx.drawImage(
      mapImg,
      x,
      y,
      CELL_SIZE,
      CELL_SIZE,
      col * CELL_SIZE - camera.x,
      row * CELL_SIZE - camera.y,
      CELL_SIZE, CELL_SIZE)
  }
}

function drawCharacter(deltaTime: number) {
  if (keyPress) {
    step = (step + 0.01 * deltaTime) % shots;
    const speed = Math.floor(0.3 * deltaTime);

    // 0 - down, 1 - left, 2 - right, 3 - up
    if (direction === 0) {
      characterY += speed;
    } else if (direction === 1) {
      characterX -= speed;
    } else if (direction === 2) {
      characterX += speed;
    } else if (direction === 3) {
      characterY -= speed;
    }

    // чтобы не убегал за пределы поля
    if (characterX < 0) {
      characterX = 0;
    } else if (characterX >= MAX_PLAYER_X - CELL_SIZE) {
      characterX = MAX_PLAYER_X - CELL_SIZE;
    }
    if (characterY < 0) {
      characterY = 0;
    } else if (characterY > MAX_PLAYER_Y - CELL_SIZE) {
      characterY = MAX_PLAYER_Y - CELL_SIZE;
    }
  }

  ctx.drawImage(
    characterImg,
    48 * Math.floor(step),
    48 * direction,
    48,
    48,
    characterX - camera.x,
    characterY - camera.y,
    CELL_SIZE,
    CELL_SIZE
  );

}

function keyDownHandler(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowUp':
    case 'Up':
      keyPress = true;
      direction = 3;
      break;
  }
  switch (event.key) {
    case 'ArrowRight':
    case 'Right':
      keyPress = true;
      direction = 2;
      break;
  }
  switch (event.key) {
    case 'ArrowDown':
    case 'Down':
      keyPress = true;
      direction = 0;
      break;
  }
  switch (event.key) {
    case 'ArrowLeft':
    case 'Left':
      keyPress = true;
      direction = 1;
      break;
  }
}

function keyUpHandler() {
  keyPress = false;
  direction = 0;
}

// событие keydown срабатывает на всех клавишах, независимо от того, есть ли у них значение
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler)