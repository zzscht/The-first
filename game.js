const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    { x: 10, y: 10 }
];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let gameInterval;
let isPaused = false;
let gameSpeed = 100;

// 游戏主循环
function gameLoop() {
    if (isPaused) return;
    
    // 移动蛇
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
        // 加快游戏速度
        if (gameSpeed > 50) {
            gameSpeed -= 2;
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, gameSpeed);
        }
    } else {
        snake.pop();
    }

    // 检查游戏结束条件
    if (isGameOver()) {
        clearInterval(gameInterval);
        alert('游戏结束！得分：' + score);
        return;
    }

    // 绘制游戏画面
    draw();
}

// 绘制游戏画面
function draw() {
    // 清空画布
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制蛇
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // 绘制食物
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

// 生成新的食物
function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    // 确保食物不会生成在蛇身上
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    }
}

// 检查游戏是否结束
function isGameOver() {
    // 撞墙
    if (snake[0].x < 0 || snake[0].x >= tileCount || 
        snake[0].y < 0 || snake[0].y >= tileCount) {
        return true;
    }

    // 撞到自己
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    return false;
}

// 开始游戏
function startGame() {
    // 重置游戏状态
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    score = 0;
    gameSpeed = 100;
    scoreElement.textContent = score;
    isPaused = false;
    generateFood();

    // 清除之前的游戏循环
    if (gameInterval) {
        clearInterval(gameInterval);
    }

    // 开始新的游戏循环
    gameInterval = setInterval(gameLoop, gameSpeed);
}

// 暂停/继续游戏
function pauseGame() {
    isPaused = !isPaused;
}

// 键盘控制
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (dy !== 1) { // 防止向下时向上移动
                dx = 0;
                dy = -1;
            }
            break;
        case 'ArrowDown':
            if (dy !== -1) { // 防止向上时向下移动
                dx = 0;
                dy = 1;
            }
            break;
        case 'ArrowLeft':
            if (dx !== 1) { // 防止向右时向左移动
                dx = -1;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx !== -1) { // 防止向左时向右移动
                dx = 1;
                dy = 0;
            }
            break;
    }
}); 