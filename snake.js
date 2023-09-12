const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d"); // get context is used for 2d games in order to draw on the canvas
const scoredText = document.querySelector("#scoredText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width; 
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "purple";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25; //the unit size is used to determine the size of the snake and the food
let running = false;
let xVelocity = unitSize; // we do this so that the snake moves to the right by default
let yVelocity = 0; // we do this so that the snake doesn't move up or down by default
let foodX;
let foodY; 
let score = 0;
// Add event listeners for directional buttons
const upButton = document.querySelector("#upBtn");
const downButton = document.querySelector("#downBtn");
const leftButton = document.querySelector("#leftBtn");
const rightButton = document.querySelector("#rightBtn");

// now our snake is an array of objects
// this is our snake
let snake = [
    {x: unitSize * 4, y: 0},
    {x: unitSize * 3, y: 0},
    {x: unitSize * 2, y: 0},
    {x: unitSize, y: 0},
    {x: 0, y: 0}

    
];

window.addEventListener("keydown", changeDirection); // 
resetBtn.addEventListener("click", resetGame);
upButton.addEventListener("click", () => changeDirectionByKey(38)); // Simulate key press for up arrow (keyCode 38)
downButton.addEventListener("click", () => changeDirectionByKey(40)); // Simulate key press for down arrow (keyCode 40)
leftButton.addEventListener("click", () => changeDirectionByKey(37)); // Simulate key press for left arrow (keyCode 37)
rightButton.addEventListener("click", () => changeDirectionByKey(39)); // Simulate key press for right arrow (keyCode 39)


gameStart();


function gameStart() {

    running = true;
    scoredText.textContent = score; // the .textContent property is used to change the text of an element
    createFood();
    drawFood();
    nextTick();
};
function nextTick() {
    if (running === true) {
        setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();    
            checkGameOver();
            nextTick(); // we envoke this again so that the game keeps running
        }, 100); // this is the speed of the game
    }
    else {
        displayGameOver();
    }
};
function clearBoard() {
    drawBackground(); // Draw the background image
    ctx.clearRect(0, 0, gameWidth, gameHeight); // Clear the canvas
}

function createFood() {
    function randomFood(min, max) {
        const radNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return radNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize);

    // print the food's coordinates to the console

}
function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
};
function moveSnake() {
    const head = {
        x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity
    };

    snake.unshift(head);

    if (head.x === foodX && head.y === foodY) {
        score += 1;
        scoredText.textContent = score;
        createFood();

        // Call the eatApple function when the snake eats the apple.
        eatApple();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder; // the strokeStyle property is used to change the color of the border of the snake, but by default strokeStyle is a black color
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    });
};
function changeDirectionByKey(keyCode) {
    // Simulate key press based on the button clicks
    const event = new KeyboardEvent("keydown", { keyCode: keyCode });
    window.dispatchEvent(event);
}
function  changeDirection(event) {
    const keyPressed = event.keyCode; // keyCode is a property of the event object, it returns the unicode of the key that was pressed
    console.log(keyPressed);
    const leftArrow = 37;
    const rightArrow = 39;
    const upArrow = 38;
    const downArrow = 40;

    const goingUp = yVelocity === -unitSize; // if the yVelocity is equal to -unitSize then the snake is going up, this is because the yVelocity is negative when the snake is going up because the y axis is inverted
    const goingDown = yVelocity === unitSize; // if the yVelocity is equal to unitSize then the snake is going down
    const goingRight = xVelocity === unitSize; // if the xVelocity is equal to unitSize then the snake is going right
    const goingLeft = xVelocity === -unitSize; // if the xVelocity is equal to -unitSize then the snake is going left

    switch (true) {
        case(keyPressed === leftArrow && !goingRight): // if the key pressed is the left arrow and the snake is not going right then the snake will go left
            xVelocity = -unitSize;
            yVelocity = 0;
            break; // we use break so that the code stops running
        case(keyPressed === upArrow && !goingDown): // if the key pressed is the up arrow and the snake is not going down then the snake will go up
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case(keyPressed === rightArrow && !goingLeft): // if the key pressed is the right arrow and the snake is not going left then the snake will go right
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case(keyPressed === downArrow && !goingUp): // if the key pressed is the down arrow and the snake is not going up then the snake will go down. The case s
            xVelocity = 0;
            yVelocity = unitSize;
            break; 
    }
};
function checkGameOver() {
    switch (true) {
        case(snake[0].x < 0): // this mean that we went over the left edge of the canvas
            running = false;
            break;
        case(snake[0].x > gameWidth - unitSize): // this mean that we went over the right edge of the canvas
            running = false;
            break;
        case(snake[0].y < 0): // this mean that we went over the top edge of the canvas
            running = false;
            break;
        case(snake[0].y > gameHeight - unitSize): // this mean that we went over the bottom edge of the canvas
            running = false;
            break;
        case(checkSnakeCollision()): // this mean that the snake collided with itself   
            drawExplodedSnake();
            running = false;
            break;
    }

};
function  displayGameOver() {
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "red";
    ctx.textAlign = "center"; // this is used to center the text horizontally
    ctx.fillText("Game Over", gameWidth / 2, gameHeight / 2); // here we center the text vertically and horizontally
    ctx.fillText(`Your score is ${score}`, gameWidth / 2, gameHeight / 2 + 50);
    
};
function resetGame() {
    snake = [
        {x: unitSize * 4, y: 0},
        {x: unitSize * 3, y: 0},
        {x: unitSize * 2, y: 0},
        {x: unitSize, y: 0},
        {x: 0, y: 0}
    ];
    xVelocity = unitSize;
    yVelocity = 0;
    score = 0;
    scoredText.textContent = score;
    running = true;
    gameStart();
};
function checkSnakeCollision() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) { // if the x and y coordinates of the head of the snake are equal to the x and y coordinates of any other part of the snake then the snake collided with itself, we need the x and y because the snake is an array of objects and each object has an x and y property because arrays are objects and objects have properties and methods 
            return true;
        }
    };


    
};
// i can add this function to the checkGameOver function to see the snake exploded, i can do it in this part: case(checkSnakeCollision()): 
function drawExplodedSnake() {
    snake.forEach(snakePart => {
        ctx.fillStyle = "red";
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    });
}

function eatApple() {
    // Get the audio file.
    const audioFile = new Audio("apple-eating-sound.mp3");
  
    // Play the audio file.
    audioFile.play();
  }

  function drawBackground() {
    const backgroundImage = new Image();
    backgroundImage.src = 'image.jpg'; // Replace with the actual filename of your image
    ctx.drawImage(backgroundImage, 0, 0, gameWidth, gameHeight);
}

  
  // Add an event listener to the "apple-eaten" event.
  document.addEventListener("apple-eaten", eatApple);
// if I want to draw a rectangle I have to do this
//si quiero mostrar en consola hola mundo tengo que hacer 
console.log("hola mundo"); //esto hara que en la consola se muestre hola mundo, para ver la consola debo hacer click derecho en la pagina y luego en inspeccionar, luego en consola