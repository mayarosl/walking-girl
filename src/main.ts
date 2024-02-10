// npm run dev
import './style.css'

import { loadImage } from './utils/loadImage';
import { calculateTileCoordinate } from './utils/calculateTileCoordinates';

import HAGESHI_WALK from './assets/HAGESHI_WALK.png';
import terrianPath from './assets/durotar.png';
import mapJSON from './assets/map.json'

const canvas = document.getElementById('game') as HTMLCanvasElement | null;

if (!canvas) throw new Error('Canvas not found')

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const COL_LENGTH = 30;

const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

function loadSprites() {
  return Promise.all([
    loadImage(HAGESHI_WALK), 
    loadImage(terrianPath)
  ]);
}

// количество кадров
const shots = 3;

let keyPress = false;
let direction = 0;

// стартовая точка персонажа
let characterX = 0;
let characterY = 0;

let step = 0;

const mapImg = new Image();
mapImg.src = terrianPath;

const characterImg = new Image();
characterImg.src = HAGESHI_WALK;



loadSprites().then(() => {
  let lastTimeUpdate = 0;

  function animate(timestamp: number) {
    const deltaTime = timestamp - lastTimeUpdate;

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
    const { x, y } = calculateTileCoordinate ({
      tileNumber: tileNumber - 1,
      width: 32,
      height: 32,
      columns: 19,
      pixelGap: 1
    });
    ctx.drawImage(mapImg, x, y, 32, 32, col * 32, row * 32, 32, 32)
  }
}

function drawCharacter(deltaTime: number) {
        if (keyPress) {
        step = (step + 0.01 * deltaTime) % shots;

        // 0 - down, 1 - left, 2 - right, 3 - up
        if (direction === 0) {
          characterY += 0.1 * deltaTime;
        } else if (direction === 1) {
          characterX -= 0.1 * deltaTime;
        } else if (direction === 2) {
          characterX += 0.1 * deltaTime;
        } else if (direction === 3) {
          characterY -= 0.1 * deltaTime;
        }

        // чтобы не убегал за пределы поля
        if (characterX < 0) {
          characterX = 0;
        } else if (characterX > CANVAS_WIDTH - 64) {
          characterX = CANVAS_WIDTH - 64;
        }
        if (characterY < 0) {
          characterY = 0;
        } else if (characterY > CANVAS_HEIGHT - 64) {
          characterY = CANVAS_HEIGHT - 64;
        }
      }

      ctx.drawImage(characterImg, 48 * Math.floor(step), 48 * direction, 48, 48, characterX, characterY, 32, 32);
  
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