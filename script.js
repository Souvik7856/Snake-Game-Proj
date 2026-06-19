const board = document.querySelector('.board');
const startButton =document.querySelector('.btn-start');
const modal = document.querySelector('.modal');
const startgameModal = document.querySelector('.start-game');
const gameoverModal =document.querySelector('.game-over');
const restartButton = document.querySelector('.btn-restart');

const highScoreElement = document.querySelector('#high-score');
const scoreElement = document.querySelector('#score');
const timeElement = document.querySelector('#time');

const blockheight = 30;
const blockwidth = 30;

let highScore = localStorage.getItem('highScore')||0;
let score = 0;
let time = `00:00`
highScoreElement.innerText = highScore;
const rows = Math.floor(board.clientHeight/blockheight);
const cols = Math.floor(board.clientWidth/blockwidth);

const blocks = [];
let snake = [{x:1,y:4},{x:1,y:5},{x:1,y:6}];
let direction = 'right';
let intervalId = null;
let timerIntervelId = null;
let food = {x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)};
for(let row=0;row<rows; row++){
    for(let col=0; col<cols; col++){
        const block = document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
        // block.innerText= `(${row}-${col})`;
        blocks[`${row}-${col}`] = block

    }
}

//-------------snake render function for snake appear --------------
function renderSnake(){
    let head = null;
    blocks[`${food.x}-${food.y}`].classList.add('food');
    if(direction === 'left'){
        head ={x:snake[0].x,y:snake[0].y-1}
    }
    else if(direction === 'right'){
        head ={x:snake[0].x,y:snake[0].y+1}
    }
    else if(direction === 'up'){
        head ={x:snake[0].x-1,y:snake[0].y}
    }
    else if(direction === 'down'){
        head = {x:snake[0].x+1,y:snake[0].y}

    }
    // -----wall collison logic------
    if(head.x<0|| head.x>=rows || head.y<0 || head.y>=cols){                   
        clearInterval(intervalId);
        modal.style.display ='flex';
        startgameModal.style.display ='none';
        gameoverModal.style.display = 'flex';
        return;
        
    }
    //------food consume and rearrange food logic-----
    if(head.x == food.x && head.y == food.y){
        blocks[`${food.x}-${food.y}`].classList.remove('food');
        food = {x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)}
        blocks[`${food.x}-${food.y}`].classList.add('food');
        snake.unshift(head);
        score += 10;
        scoreElement.innerText = score;
        if(score>highScore){
            highScore = score;
            localStorage.setItem("highScore",highScore.toString());
        }
    }
    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill');
    })
     snake.unshift(head); //--- for add new element of the sanke head----
     snake.pop()
    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.add('fill');
    })
}
//--------------snake head movement logic----------------------
//--- for start button for start the game-----
startButton.addEventListener('click',()=>{
    modal.style.display ='none'
    intervalId = setInterval(() => {        
        renderSnake();
    }, 400);
    timerIntervelId = setInterval(() => {
        let [min,sec] = time.split(':').map(Number);
        if(sec == 59){
            min +=1
            sec=0
        }
        else{
            sec+=1
        }
        time= `${min}:${sec}`;
        timeElement.innerText = time;
    },1000);
})

restartButton.addEventListener('click',restartGame)
// ---game over function ---
function restartGame(){
    blocks[`${food.x}-${food.y}`].classList.remove('food');
    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill');
    });
    direction = 'down';
    score = 0;
    time = `00:00`;
    scoreElement.innerText = score;
    timeElement.innerText = time;
    highScoreElement.innerText = highScore;
    modal.style.display = 'none';
    snake = [{x:1,y:4},{x:1,y:5},{x:1,y:6}];
    food = {x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)};
    intervalId = setInterval(() => {        
        renderSnake();
    }, 400);

}

//-----------key controls logic---------------
addEventListener('keydown',(event)=>{
    if(event.key == 'ArrowUp'){
        direction='up';
    }
    else if(event.key == 'ArrowDown'){
        direction='down';
    }
    else if(event.key == 'ArrowRight'){
        direction = 'right';
    }
    else if(event.key == 'ArrowLeft'){
        direction = 'left';
    }
    
})

