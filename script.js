const board = document.querySelector('.board');
const blockheight = 50;
const blockwidth = 50;
const rows = Math.floor(board.clientHeight/blockheight);
const cols = Math.floor(board.clientWidth/blockwidth);

const blocks = [];
const snake = [{x:1,y:4},{x:1,y:5},{x:1,y:6}]
let direction = 'right'
let intervalId = null;
let food = {x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)};
for(let row=0;row<rows; row++){
    for(let col=0; col<cols; col++){
        const block = document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
        block.innerText= `(${row}-${col})`;
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
    // -----game over logic------
    if(head.x<0|| head.x>=rows || head.y<0 || head.y>=cols){        
        alert('Game Over');
        clearInterval(intervalId);
        
    }
    //------food consume and rearrange food logic-----
    if(head.x == food.x && head.y == food.y){
        blocks[`${food.x}-${food.y}`].classList.remove('food');
        food = {x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)}
        blocks[`${food.x}-${food.y}`].classList.add('food');
        snake.unshift(head);
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
//  intervalId = setInterval(() => {   
//     renderSnake();
// },400);

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

