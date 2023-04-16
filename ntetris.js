function Ntetris(parametros) {
    // Obtener referencia al canvas y al contexto de dibujo
    const canvas = parametros.canvas;
    const ctx = canvas.getContext('2d');

    // Constantes
    const board_width = parametros.board_width?parametros.board_width:10;
    const board_height = parametros.board_height?parametros.board_height:20;
    const piece_shapes = [
        // I
        {
            shape: [[1, 1, 1, 1]],
            color: 'red',
        },
        // J
        {
            shape: [
                [0, 0, 2],
                [2, 2, 2]
            ],
            color: 'magenta',
        },
        // L
        {
            shape: [
                [3, 0, 0],
                [3, 3, 3]
            ],
            color: 'yellow',
        },
        // O
        {
            shape: [
                [4, 4],
                [4, 4]
            ],
            color: 'blue',
        },
        // S
        {
            shape: [
                [0, 5, 5],
                [5, 5, 0]
            ],
            color: 'cyan',
        },
        // T
        {
            shape: [
                [0, 6, 0],
                [6, 6, 6]
            ],
            color: 'green',
        },
        // Z
        {
            shape: [
                [7, 7, 0],
                [0, 7, 7]
            ],
            color: 'orange',
        }
    ];

    // puntuacion
    const xlinea = parametros.xlinea?parametros.xlinea:[100, 200, 400, 800];
    const tspin1 = 800;
    const tspin2 = 1200;
    const caidalibre_consecutiva = 50;

    // Variables
    let currentPiece = null;
    let currentX = 0;
    let currentY = 0;
    
    let down_time = parametros.down_time?parametros.down_time:800; // milisegundos
    const board = [];
    for (let i = 0; i < board_height; i++) {
        board[i] = [];
        for (let j = 0; j < board_width; j++) {
            board[i][j] = 0;
        }
    }

    let score = 0;
    let lines = 0;
    let gameOver = true;

    // Definir tamaño del canvas
    canvas.width = 400;
    canvas.height = 400;

    // Dibujar el tablero
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width / 2, canvas.height);

    // Definir tamaño de las celdas y bordes
    const border_width = 1;

    const cell_size_x = (canvas.width / 2 / board_width);
    const cell_size_y = (canvas.height / board_height);

    let time_out = null;

    // Dibujar las celdas del tablero
    const draw_board = ()=>{
        ctx.fillStyle = '#000'; // dibuja el fondo del tablero
        ctx.fillRect(0, 0, canvas.width / 2, canvas.height);
        for (let y = 0; y < board_height; y++) {
            for (let x = 0; x < board_width; x++) {
                // Calcular la posición en píxeles de la celda
                const xPos = x * cell_size_x;
                const yPos = y * cell_size_y;
                // Dibujar la celda (si está ocupada)
                if (board[y][x]) {
                    // Dibujar el borde de la celda
                    ctx.fillStyle = '#ccc';
                    ctx.fillRect(xPos, yPos, cell_size_x, cell_size_y);
                    // Dibujar la celda
                    ctx.fillStyle = '#aaa';
                    ctx.fillRect(xPos + border_width, yPos + border_width, cell_size_x - border_width * 2, cell_size_y - border_width * 2);
                }
            }
        }
    }

    const getRandomPiece = ()=>{
        const randomIndex = Math.floor(Math.random() * piece_shapes.length);
        newPiece = piece_shapes[randomIndex];
        return newPiece;
    }

    const drawPiece = (piece, x, y)=>{
        // Dibujar la forma de la pieza en el canvas
        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[row].length; col++) {
                if (piece.shape[row][col]) {
                    const xPos = (x + col) * cell_size_x;
                    const yPos = (y + row) * cell_size_y;
                    ctx.fillStyle = piece.color;
                    ctx.fillRect(xPos + border_width, yPos + border_width, cell_size_x - border_width * 2, cell_size_y - border_width * 2);
                }
            }
        }
    }

    const erasePiece = (piece, x, y)=>{
        // Borrar la forma de la pieza del canvas
        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[row].length; col++) {
                if (piece.shape[row][col]) {
                    const xPos = (x + col) * cell_size_x;
                    const yPos = (y + row) * cell_size_y;
                    ctx.fillStyle = '#000';
                    ctx.fillRect(xPos, yPos, cell_size_x, cell_size_y);
                }
            }
        }
    }

    const isPieceOverlap = (piece, x, y)=>{
        // Comprobar cada celda de la pieza si se superpone con alguna celda del tablero
        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[row].length; col++) {
                if (piece.shape[row][col]) {
                    const boardRow = y + row;
                    const boardCol = x + col;
                    // Comprobar si la celda de la pieza se superpone con una celda del tablero
                    if (boardRow < 0 || boardRow >= board_height || boardCol < 0 || boardCol >= board_width || board[boardRow][boardCol]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    const placePieceOnBoard = (piece, x, y)=>{
        // Copiar cada celda de la pieza al tablero
        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[row].length; col++) {
                if (piece.shape[row][col]) {
                    const boardRow = y + row;
                    const boardCol = x + col;
                    board[boardRow][boardCol] = piece.color;
                }
            }
        }
    }

    const rotatePiece = (piece, direction)=>{
        const shape = piece.shape;
        const newShape = [];

        if (direction == 'right') {
            for (let i = 0; i < shape[0].length; i++) {
                const newRow = [];
                for (let j = shape.length - 1; j >= 0; j--) {
                    newRow.push(shape[j][i]);
                }
                newShape.push(newRow);
            }
        } else if (direction == 'left') {
            for (let i = shape[0].length - 1; i >= 0; i--) {
                const newRow = [];
                for (let j = 0; j < shape.length; j++) {
                    newRow.push(shape[j][i]);
                }
                newShape.push(newRow);
            }
        }

        return {
            shape: newShape,
            color: piece.color
        };
    }

    const checkAndRemoveRows = ()=>{
        let filasEliminadas = 0;
        for (let i = board.length - 1; i >= 0; i--) {
            if (board[i].every(cell => cell !== 0)) { // si todas las celdas de la fila no son 0
                board.splice(i, 1); // eliminar fila i
                filasEliminadas++;
            }
        }
        // Agregar filas vacías en la parte superior del tablero
        for (let i = 0; i < filasEliminadas; i++) {
            board.unshift(Array(board[0].length).fill(0));
        }
        return filasEliminadas;
    }

    const play_game = ()=>{

        ctx.clearRect(0, 0, canvas.width / 2, canvas.height); // borra tablero

        if (isPieceOverlap(currentPiece, currentX, currentY)) {
            placePieceOnBoard(currentPiece, currentX, currentY - 1);
            currentPiece = getRandomPiece(currentPiece);
            currentX = 0;
            currentY = 0;
            if (isPieceOverlap(currentPiece, currentX, currentY)) {
                ctx.fillStyle = 'white';
                ctx.fillRect(
                    canvas.width / 2, 2 + 4 * canvas.height / 20,
                    canvas.width, 2 + 1 * canvas.height / 20
                );
                ctx.strokeText('GAME OVER', canvas.width / 2 + canvas.width / 4, 5 * canvas.height / 20);
                gameOver = true;
            }
        }


        removed_rows = checkAndRemoveRows(board);
        if (removed_rows > 0) {
            addScore(xlinea[removed_rows - 1], removed_rows);
        }
        draw_board();
        if (!gameOver) {
            drawPiece(currentPiece, currentX, currentY);
            time_out = setTimeout(() => {
                currentY = currentY + 1;
                play_game();
            }, down_time);
        }

    }

    const start_game = ()=>{
        clearTimeout(time_out);
        currentPiece = getRandomPiece(null);
        currentX = 0;
        currentY = 0;
        score = 0;
        lines = 0;
        gameOver = false;
        down_time = 1000; // milisegundos
        for (let i = 0; i < board_height; i++) {
            board[i] = [];
            for (let j = 0; j < board_width; j++) {
                board[i][j] = 0;
            }
        }
        play_game();
    }

    const addScore = (puntos, lineas)=>{
        score = score + puntos;
        lines = lines + lineas;
        ctx.fillStyle = 'white';
        ctx.fillRect(
            canvas.width / 2, 2 + 7 * canvas.height / 20,
            canvas.width, 2 + 1 * canvas.height / 20
        );
        ctx.strokeText(score, canvas.width / 2 + canvas.width / 4, 8 * canvas.height / 20);

        ctx.fillStyle = 'white';
        ctx.fillRect(
            canvas.width / 2, 2 + 10 * canvas.height / 20,
            canvas.width, 2 + 1 * canvas.height / 20
        );
        ctx.strokeText(lines, canvas.width / 2 + canvas.width / 4, 11 * canvas.height / 20);
    }
    
    document.addEventListener('keydown', event=>{
        switch (event.keyCode) {
            case 37: // Flecha izquierda
                if (!isPieceOverlap(currentPiece, currentX - 1, currentY)) {
                    erasePiece(currentPiece, currentX, currentY);
                    currentX = currentX - 1;
                    drawPiece(currentPiece, currentX, currentY);
                }
                break;
            case 38: // Flecha arriba

                break;
            case 39: // Flecha derecha
                if (!isPieceOverlap(currentPiece, currentX + 1, currentY)) {
                    erasePiece(currentPiece, currentX, currentY);
                    currentX = currentX + 1;
                    drawPiece(currentPiece, currentX, currentY);
                }
                break;
            case 40: // Flecha abajo
                if (!isPieceOverlap(currentPiece, currentX, currentY + 1)) {
                    erasePiece(currentPiece, currentX, currentY);
                    currentY = currentY + 1;
                    drawPiece(currentPiece, currentX, currentY);
                }
                break;
            case 90: // La tecla 'z' ha sido presionada
                piece_temp = rotatePiece(currentPiece, 'left');
                if (!isPieceOverlap(piece_temp, currentX, currentY)) {
                    erasePiece(currentPiece, currentX, currentY);
                    currentPiece = piece_temp;
                    drawPiece(currentPiece, currentX, currentY);
                }
                break;
            case 88: // La tecla 'x' ha sido presionada
                piece_temp = rotatePiece(currentPiece, 'right');
                if (!isPieceOverlap(piece_temp, currentX, currentY)) {
                    erasePiece(currentPiece, currentX, currentY);
                    currentPiece = piece_temp;
                    drawPiece(currentPiece, currentX, currentY);
                }
                break;
            case 13:
                if (gameOver) {
                    start_game();
                }
                break;
        }
    });

    ctx.strokeStyle = "black";
    ctx.font = canvas.height / 30 + "pt Courier New";
    ctx.textAlign = "center";
    ctx.strokeText("Puntuacion", canvas.width / 2 + canvas.width / 4, 7 * canvas.height / 20);
    ctx.strokeText("Lineas", canvas.width / 2 + canvas.width / 4, 10 * canvas.height / 20);
    ctx.fillStyle = 'white';
    ctx.fillRect(
        canvas.width / 2, 2 + 7 * canvas.height / 20,
        canvas.width, 2 + 1 * canvas.height / 20
    );
    ctx.strokeText(score, canvas.width / 2 + canvas.width / 4, 8 * canvas.height / 20);
    ctx.fillRect(
        canvas.width / 2, 2 + 10 * canvas.height / 20,
        canvas.width, 2 + 1 * canvas.height / 20
    );
    ctx.strokeText(lines, canvas.width / 2 + canvas.width / 4, 11 * canvas.height / 20);
}