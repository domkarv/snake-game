const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const snakeImage = document.getElementById("snake-image");
const score = document.getElementById("score");
const highScoreText = document.getElementById("high-score");

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let currentScore = 0;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

function drawObjects() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
}

/**
 * @param {string} tag - The HTML tag of the element that you want to create
 * @param {string} className - The class name you want to give to element, so your styles can be applied to the element
 * @returns {HTMLElement}
 */
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

/**
 * @param {HTMLElement} element - Element you want to position
 * @param {{x: number, y: number}} position - Position you want to set the element to
 */
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

/**
 * @returns {{x: number, y: number}} Returns the new generated position of the food
 */
function generateFood() {
  return {
    x: Math.floor(Math.random() * gridSize) + 1,
    y: Math.floor(Math.random() * gridSize) + 1,
  };
}

function moveSnake() {
  const head = { ...snake[0] };
  switch (direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
  }

  snake.unshift(head); // Add new head

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    currentScore = snake.length - 1;
    updateScore();
    increaseSpeed();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      moveSnake();
      checkCollision();
      drawObjects();
    }, gameSpeedDelay);
  } else {
    snake.pop(); // Remove tail
  }
}

function increaseSpeed() {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

function startGame() {
  if (!gameStarted) {
    gameStarted = true;

    // set score to 0 and update the score
    currentScore = 0;
    updateScore();

    instructionText.style.display = "none";
    snakeImage.style.display = "none";

    gameInterval = setInterval(() => {
      drawObjects();
      moveSnake();
      checkCollision();
    }, gameSpeedDelay);
  }
}

function handleKeyPress(event) {
  if (!gameStarted && event.code === "Space") {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      case "ArrowRight":
        direction = "right";
        break;
    }
  }
}

/**
 * Game starts here
 */
document.addEventListener("keydown", handleKeyPress);

function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateScore();
  updateHighScore();

  clearInterval(gameInterval);
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  gameStarted = false;

  const snakeElement = document.querySelector(".snake");
  const foodElement = document.querySelector(".food");
  snakeElement.style.display = "none";
  foodElement.style.display = "none";

  instructionText.style.display = "block";
  snakeImage.style.display = "block";
}

function updateScore() {
  score.textContent = currentScore.toString().padStart(3, "0");
}

function updateHighScore() {
  console.log(currentScore, highScore);
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, "0");
    highScoreText.style.display = "block";
  }
}
