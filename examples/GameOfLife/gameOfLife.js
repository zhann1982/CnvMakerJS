let canvasWidth = 1200, canvasHeight = 600, canvasParentNode = '#root', offset = 60;

let c = new CnvMaker(canvasParentNode, canvasWidth, canvasHeight);
    c.fillCanvas('black');

let squares = [];

let squareSideLength = 10,   // 10 pixels
    fieldStartPoint = [-offset, -offset], // Field will be larger than canvas viewport
    fieldEndPoint = [canvasWidth + offset, canvasHeight + offset];

let squareCountWidth = -(fieldStartPoint[0] - fieldEndPoint[0]) / squareSideLength,
    squareCountHeight = -(fieldStartPoint[1] - fieldEndPoint[1]) / squareSideLength;

let dead = 'black', alive = 'white';

for (let i=0; i<squareCountWidth; i++) {
    let row = [];
    for (let j=0; j<squareCountHeight; j++) {
        row.push({
            lineWidth: 1,
            color: dead,
            fillColor: dead,
            radius: squareSideLength/2 - 1,
            center: [i*squareSideLength+squareSideLength/2, j*squareSideLength+squareSideLength/2],
            newState: dead,
            oldState: dead,
            i: i,
            j: j
        });
    }
    squares.push(row);
}

let clearCells = () => {
    for (let i=0; i<squareCountWidth; i++) {
        for (let j=0; j<squareCountHeight; j++) {
            squares[i][j].fillColor = dead;
            squares[i][j].Color = dead;
            squares[i][j].oldState = dead;
            squares[i][j].newState = dead;
        }
    }
    c.fillCanvas(dead);
    drawGrid();
}

let drawCell = () => {
    const cnvRect = c.canvasNode.getBoundingClientRect();
    let xPixel = event.clientX - cnvRect.left,
        yPixel = event.clientY - cnvRect.top;
    let coordX = Math.floor(xPixel / squareSideLength),
        coordY = Math.floor(yPixel / squareSideLength);
    squares[coordX][coordY].fillColor = alive;
    squares[coordX][coordY].color = alive;
    squares[coordX][coordY].oldState = alive;
    squares[coordX][coordY].newState = alive;
    c.disk(squares[coordX][coordY]);
}

let drawGrid = () => {
    for (let i=0; i<squareCountWidth; i++) {
        c.line({
            lineWidth: 1,
            color: '#222',
            start: [i*squareSideLength-offset, fieldStartPoint[1]],
            end: [i*squareSideLength-offset, fieldEndPoint[1]]
        });
    }
    for (let j=0; j<squareCountHeight; j++) {
        c.line({
            lineWidth: 1,
            color: '#222',
            start: [fieldStartPoint[0], j*squareSideLength-offset],
            end: [fieldEndPoint[0], j*squareSideLength-offset]
        });
    }
}

drawGrid();

c.canvasNode.addEventListener('mousedown', () => {
    drawCell();
    c.canvasNode.addEventListener('mousemove', drawCell);
});

c.canvasNode.addEventListener('mouseup', () => {
    c.canvasNode.removeEventListener('mousemove', drawCell);
});

c.canvasNode.removeEventListener('mousemove', drawGrid);

let getNewState = (x,y) => {
    let alives = 0;
    for (let i = x-1; i < x+2; i++) {
        for (let j = y-1; j < y+2; j++) {
            if ((i===x && j===y) || i < 0 || j < 0 || i >= squareCountWidth || j >= squareCountHeight) continue;
            if (squares[i][j].oldState === alive) alives += 1;
        }
    }
    if (squares[x][y].oldState === dead) {
        if (alives === 3) {
            return alive;
        } else {
            return dead;
        }
    }
    if (squares[x][y].oldState === alive) {
        if (alives === 3 || alives === 2) {
            return alive;
        } else {
            return dead;
        }
    }
}

let animation;
let frame = () => {
    c.fillCanvas(dead);
    drawGrid();
    for (let i=0; i<squareCountWidth; i++) {
        for (let j=0; j<squareCountHeight; j++) {
            let newState = getNewState(i,j);
            squares[i][j].newState = newState;
            squares[i][j].color = newState;
            squares[i][j].fillColor = newState;
        }
    }

    for (let i=0; i<squareCountWidth; i++) {
        for (let j=0; j<squareCountHeight; j++) {
            c.disk(squares[i][j]);
            squares[i][j].oldState = squares[i][j].newState; 
        }
    }

    animation = requestAnimationFrame(frame);
}

let clearButton = document.querySelector('#clear');
let startButton = document.querySelector('#start');
let stopButton = document.querySelector('#stop');

startButton.addEventListener('click', frame);
stopButton.addEventListener('click', ()=>{
    window.cancelAnimationFrame(animation);
    drawGrid();
});
clearButton.addEventListener('click', () => {
    window.cancelAnimationFrame(animation);
    clearCells();
});