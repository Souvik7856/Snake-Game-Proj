const board = document.querySelector('.board');
const blockheight = 30;
const blockwidth = 30;
const rows = Math.floor(board.clientWidth/blockwidth);
const cols = Math.floor(board.clientHeight/blockheight);
for(let i = 0; i< cols*rows; i++){
    const block = document.createElement('div');
    block.classList.add('block');
    board.appendChild(block);
}