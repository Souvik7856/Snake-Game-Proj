function snakeGame() {
    const board = document.querySelector('.board');
    const startButton = document.querySelector('.btn-start');
    const modal = document.querySelector('.modal');
    const startgameModal = document.querySelector('.start-game');
    const gameoverModal = document.querySelector('.game-over');
    const restartButton = document.querySelector('.btn-restart');

    const highScoreElement = document.querySelector('#high-score');
    const scoreElement = document.querySelector('#score');
    const timeElement = document.querySelector('#time');

    const blockheight = 30;
    const blockwidth = 30;

    let highScore = localStorage.getItem('highScore') || 0;
    let score = 0;
    let time = `00:00`
    highScoreElement.innerText = highScore;
    const rows = Math.floor(board.clientHeight / blockheight);
    const cols = Math.floor(board.clientWidth / blockwidth);

    const blocks = [];
    let snake = [{ x: 1, y: 6 }, { x: 1, y: 5 }, { x: 1, y: 4 }];
    let direction = 'right';
    let intervalId = null;
    let timerIntervelId = null;
    let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };

    let bonusFood = null;
    let bonusFoodVisible = false;
    let bonusFoodTimer = null;
    let foodsEaten = 0;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const block = document.createElement('div');
            block.classList.add('block');
            board.appendChild(block);
            // block.innerText= `(${row}-${col})`;
            blocks[`${row}-${col}`] = block

        }
    }

    //-------------snake render function for snake appear --------------
    function renderSnake() {
        let head = null;
        let ateFood = false;

        blocks[`${food.x}-${food.y}`].classList.add('food');

        if (direction === 'left') {
            head = { x: snake[0].x, y: snake[0].y - 1 };
        }
        else if (direction === 'right') {
            head = { x: snake[0].x, y: snake[0].y + 1 };
        }
        else if (direction === 'up') {
            head = { x: snake[0].x - 1, y: snake[0].y };
        }
        else if (direction === 'down') {
            head = { x: snake[0].x + 1, y: snake[0].y };
        }

        // -----wall collision------
        if (
            head.x < 0 ||
            head.x >= rows ||
            head.y < 0 ||
            head.y >= cols
        ) {
            gameOver();
            return;
        }
        if (
            snake.some(segment =>
                segment.x === head.x &&
                segment.y === head.y
            )
        ) {
            gameOver();
            return;
        }


        // -----NORMAL FOOD------
        if (head.x === food.x && head.y === food.y) {

            blocks[`${food.x}-${food.y}`]
                .classList.remove('food');

            food = {
                x: Math.floor(Math.random() * rows),
                y: Math.floor(Math.random() * cols)
            };

            blocks[`${food.x}-${food.y}`]
                .classList.add('food');

            ateFood = true;

            foodsEaten++;

            score += 10;

            if (foodsEaten % 5 === 0) {
                spawnBonusFood();
            }

            scoreElement.innerText = score;

            if (score > highScore) {
                highScore = score;

                localStorage.setItem(
                    "highScore",
                    highScore.toString()
                );
            }
        }

        // -----BONUS FOOD------
        if (
            bonusFoodVisible &&
            head.x === bonusFood.x &&
            head.y === bonusFood.y
        ) {

            clearTimeout(bonusFoodTimer);

            blocks[`${bonusFood.x}-${bonusFood.y}`]
                .classList.remove('bonus-food');

            bonusFoodVisible = false;
            bonusFood = null;

            ateFood = true;

            score += 50;

            scoreElement.innerText = score;
        }

        // remove old snake
        snake.forEach(segment => {
            blocks[`${segment.x}-${segment.y}`]
                .classList.remove('fill');
        });

        // move snake
        snake.unshift(head);

        // remove tail only if no food eaten
        if (!ateFood) {
            snake.pop();
        }

        // draw snake
        snake.forEach(segment => {
            blocks[`${segment.x}-${segment.y}`]
                .classList.add('fill');
        });
    }
    function gameOver() {
        clearInterval(intervalId);

        modal.style.display = 'flex';
        startgameModal.style.display = 'none';
        gameoverModal.style.display = 'flex';
    }
    //--------------snake head movement logic----------------------
    //--- for start button for start the game-----
    startButton.addEventListener('click', () => {
        modal.style.display = 'none'
        intervalId = setInterval(() => {
            renderSnake();
        }, 200);
        timerIntervelId = setInterval(() => {
            let [min, sec] = time.split(':').map(Number);
            if (sec == 59) {
                min += 1
                sec = 0
            }
            else {
                sec += 1
            }
            time = `${min}:${sec}`;
            timeElement.innerText = time;
        }, 1000);
    })

    restartButton.addEventListener('click', restartGame)
    // ---game over function ---
    function restartGame() {
        blocks[`${food.x}-${food.y}`].classList.remove('food');
        snake.forEach(segment => {
            blocks[`${segment.x}-${segment.y}`].classList.remove('fill');
        });
        direction = 'down';
        score = 0;
        time = `00:00`;
        scoreElement.innerText = score;
        timeElement.innerText = time;
        highScoreElement.innerText = highScore;
        modal.style.display = 'none';
        snake = [{ x: 1, y: 4 }, { x: 1, y: 5 }, { x: 1, y: 6 }];
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
        intervalId = setInterval(() => {
            renderSnake();
        }, 200);

    }

    //----------bonus food option logic-------
    function spawnBonusFood() {
        if (bonusFoodVisible) return;
        bonusFood = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols)
        };
        bonusFoodVisible = true;
        blocks[`${bonusFood.x}-${bonusFood.y}`]
            .classList.add('bonus-food');

        bonusFoodTimer = setTimeout(() => {

            blocks[`${bonusFood.x}-${bonusFood.y}`]
                .classList.remove('bonus-food');

            bonusFoodVisible = false;
            bonusFood = null;

        }, 9000);
    }
    //-----------key controls logic---------------
    addEventListener('keydown', (event) => {
        if (event.key == 'ArrowUp' && direction != 'down') {
            direction = 'up';
        }
        else if (event.key == 'ArrowDown' && direction != 'up') {
            direction = 'down';
        }
        else if (event.key == 'ArrowRight' && direction != 'left') {
            direction = 'right';
        }
        else if (event.key == 'ArrowLeft' && direction != 'right') {
            direction = 'left';
        }

    })


}
snakeGame();