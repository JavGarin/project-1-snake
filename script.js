// HTML Elements
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const gameOverSign = document.getElementById('gameOver');

// Game Settings
const boardSize = 10;
const gameSpeed = 100;
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2
};
// Diccionario de direcciones
const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1,
};

// Game variables
let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;

// Función para dibujar el snake en el tablero.
const drawSnake = () => {
    snake.forEach((square) => {
        drawSquare(square, 'snakeSquare');
    });
}

// rellena cada cuadrado del tablero
// @params
// square: posicion del cuadrado,
// type: tipo de cuadrado (emptySquare, snakeSquare, foodSquare)

// Función para dibujar un cuadrado en el tablero.
const drawSquare = (square, type) => {
    const row = parseInt(square[0]); // Extraer el índice de la fila
    const column = parseInt(square[1]); // Extraer el índice de la columna
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);

    // condicional para agregar un square al array de emptySquares y eliminarlo si ya existe.
    if(type === 'emptySquare') {
        emptySquares.push(square);
    } else {
        if(emptySquares.indexOf(square) !== -1) {
            emptySquares.splice(emptySquares.indexOf(square), 1);
        }
    }
}

const moveSnake = () => {
    const newSquare = String(
        Number(snake[snake.length - 1]) + directions[direction])
        .padStart(2, '0');
    const [row, column] = newSquare.split('');
    
    // condicional para verificar si el snake se sale del tablero.
        if(newSquare < 0 ||
            newSquare > boardSize * boardSize ||
            (direction === 'ArrowRight' && column == 0) ||
            (direction === 'ArrowLeft' && column == 9) ||
            boardSquares[row][column] === squareTypes.snakeSquare) {
            gameOverSign();    
        } else { // condicional para mover el snake.
            snake.push(newSquare);
            if(boardSquares[row][column] === squareTypes.foodSquare) {
                addFood();
            } else { // condicional para eliminar el último cuadrado del snake.
                const emptySquare = snake.shift();
                drawSquare(emptySquare, 'emptySquare');
            }
            drawSquare();
        }
}

// Función para agregar comida al snake.
const addFood = () => {
    score++;
    updateScore();
    createRandomFood();
}

// Función para terminar el juego.
const gameOver = () => {
    gameOverSign.style.display = 'block';
    clearInterval(moveInterval)
    startButton.disabled = false;
}

const setDirection = newDirection => {
    direction = newDirection;
}

// direcciones del snake.
const directionEvent = key => {
    switch(key.code) {
        case 'ArrowUp':
            direction !== 'ArrowDown' && setDirection(key.code)
            break;
        case 'ArrowDown':
            direction !== 'ArrowUp' && setDirection(key.code)
            break;
        case 'ArrowRight':
            direction !== 'ArrowLeft' && setDirection(key.code)
            break;
        case 'ArrowLeft':
            direction !== 'ArrowRight' && setDirection(key.code)
            break;
    }
}

// Función para crear comida aleatoria.
const createRandomFood = () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomEmptySquare, 'foodSquare');
}
// Función para actualizar el score.
const updateScore = () => {
    scoreBoard.innerText = score;
}
// Función para crear el tablero.
const createBoard = () => {
    boardSquares.forEach( (row, rowIndex) => {
        row.forEach((column, columnIndex) => {
            const squareValue = `${rowIndex}${columnIndex}`;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);
        })
    })
};

// Función para reiniciar el juego.
const setGame = () => {
    snake = ['00', '01', '02', '03'];
    score = snake.length;
    direction = 'ArrowRight';
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
    console.log(boardSquares);
    board.innerHTML = '';
    emptySquares = [];
    createBoard();
}

// Función para iniciar el juego.
const startGame = () => {
    setGame();
    gameOverSign.style.display = 'none';
    startButton.disabled = true;
    drawSnake();
    updateScore();
    createRandomFood();
    document.addEventListener('keydown', directionEvent);
    moveInterval = setInterval( () => moveSnake(), gameSpeed);
}

// Evento para iniciar el juego.
startButton.addEventListener('click', startGame);