const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");
const restartBtn = document.getElementById("restartBtn");

const gridSize = 10;
const tileCount = canvas.width / gridSize;

let snake;
let food;
let dx;
let dy;
let score;
let highScore = localStorage.getItem("snakeHighScore") || 0;

highScoreElement.textContent = highScore;

function initGame(){

    snake = [
        {x:100,y:100},
        {x:80,y:100},
        {x:60,y:100}
    ];

    dx = gridSize;
    dy = 0;

    score = 0;
    scoreElement.textContent = score;

    generateFood();

    clearInterval(window.gameLoop);

    window.gameLoop = setInterval(main,100);
    canvas.focus();
}

function main(){

    if(gameOver()){
        clearInterval(window.gameLoop);
        return;
    }

    moveSnake();

    ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    drawFood();
    drawSnake();
}

function drawSnake(){

    snake.forEach((part,index)=>{

        ctx.fillStyle=index===0 ? "#4CAF50" : "#388E3C";

        ctx.fillRect(
            part.x,
            part.y,
            gridSize,
            gridSize
        );
    });
}

function moveSnake(){

    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    snake.unshift(head);

    if(head.x===food.x && head.y===food.y){

        score += 10;
        if(score > highScore){
            highScore = score;
            localStorage.setItem("snakeHighScore", highScore);
            highScoreElement.textContent = highScore;
        }
        scoreElement.textContent = score;

        generateFood();

    }else{
        snake.pop();
    }
}

function drawFood(){

    ctx.fillStyle="red";

    ctx.fillRect(
        food.x,
        food.y,
        gridSize,
        gridSize
    );
}

function generateFood(){

    food = {
        x: Math.floor(Math.random()*tileCount)*gridSize,
        y: Math.floor(Math.random()*tileCount)*gridSize
    };
}

function gameOver(){

    if(
        snake[0].x < 0 ||
        snake[0].x >= canvas.width ||
        snake[0].y < 0 ||
        snake[0].y >= canvas.height
    ){
        return true;
    }

    return false;
}

function setDirection(dir){

    if(dir==="left" && dx===0){
        dx=-gridSize;
        dy=0;
    }

    if(dir==="right" && dx===0){
        dx=gridSize;
        dy=0;
    }

    if(dir==="up" && dy===0){
        dx=0;
        dy=-gridSize;
    }

    if(dir==="down" && dy===0){
        dx=0;
        dy=gridSize;
    }
}

window.addEventListener("keydown",(e)=>{

    if(e.key==="ArrowLeft") setDirection("left");
    if(e.key==="ArrowRight") setDirection("right");
    if(e.key==="ArrowUp") setDirection("up");
    if(e.key==="ArrowDown") setDirection("down");

});

restartBtn.addEventListener("click",initGame);

initGame();