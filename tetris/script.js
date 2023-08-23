

"use strict";

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20)



/**
 * Realiza una eliminación de filas completas en la arena del juego y ajusta el puntaje del jugador.
 * Si una fila está completa, se elimina y las filas superiores caen hacia abajo.
 *
 * @function
 * @throws {Error} - Lanza una excepción en caso de errores no especificados.
 * @example
 * arenaSweep();
 */
// Esta función se encarga de eliminar las filas completas en el área de juego (arena).
function arenaSweep() {
    /**
     * Contador de filas eliminadas.
     * @type {number}
     */
    let rowCount = 1; // Contador para llevar el seguimiento del puntaje y el multiplicador de puntaje.
    
    // Iteramos a través de las filas del área de juego en orden inverso.
    outer: for (let y = arena.length - 1; y >= 0; --y) {
        // Iteramos a través de las celdas de la fila actual.
        for (let x = 0; x < arena[y].length; ++x) {
            // Si encontramos una celda vacía, salimos del bucle exterior.
            if (arena[y][x] === 0) {
                continue outer;
            }
        }
        
        // Si llegamos aquí, significa que la fila está completa.
        // Removemos la fila completa y la llenamos con ceros.
        const row = arena.splice(y, 1)[0].fill(0);
        // Agregamos la fila completa en la parte superior del área de juego.
        arena.unshift(row);
        ++y; // Volvemos a verificar la misma fila, ya que ahora hay una nueva fila en la parte superior.
        
        // Actualizamos el puntaje del jugador, multiplicando por la cantidad de filas eliminadas.
        player.score += rowCount * 10;
        rowCount *= 2; // Doblamos el multiplicador de puntaje.
    }
}



// Esta función comprueba si hay colisión entre la matriz del jugador y la matriz del escenario.
/**
 * Comprueba si hay colisión entre la matriz del jugador y la matriz del escenario.
 * @param {Array} arena - Matriz del escenario donde se realiza el juego.
 * @param {Object} player - Objeto que representa al jugador, con su matriz y posición.
 * @returns {boolean} - `true` si hay colisión, `false` si no hay colisión.
 */
function collide(arena, player) {
    const playerMatrix = player.matrix; // Matriz del jugador
    const playerPosition = player.pos; // Posición del jugador
    
    // Recorre las filas de la matriz del jugador
    for (let y = 0; y < playerMatrix.length; ++y) {
        // Recorre las columnas de la matriz del jugador
        for (let x = 0; x < playerMatrix[y].length; ++x) {
            // Comprueba si el valor en la matriz del jugador no es cero
            // y si el valor correspondiente en la matriz del escenario no es cero
            if (playerMatrix[y][x] !== 0 &&
                (arena[y + playerPosition.y] && 
                    arena[y + playerPosition.y][x + playerPosition.x]) !== 0) {
                return true; // Se produce una colisión
            }
        }
    }
    return false; // No se produce colisión
}




// Esta función crea una matriz bidimensional de ceros con dimensiones dadas.
/**
 * Crea una matriz bidimensional con dimensiones dadas, llenando todas las celdas con ceros.
 *
 * @param {number} w - El ancho de la matriz (número de columnas).
 * @param {number} h - La altura de la matriz (número de filas).
 * @returns {Array<Array<number>>} Una matriz bidimensional de ceros con las dimensiones especificadas.
 */
function createMatrix (w, h){
    // Se inicializa un arreglo vacío llamado "matrix" que almacenará la matriz resultante.
    const matrix = [];

    // Un bucle "while" se ejecutará mientras el valor de "h" sea verdadero (diferente de 0).
    while(h--){
        // En cada iteración, se crea un nuevo arreglo de longitud "w" y se llena con ceros.
        matrix.push(new Array(w).fill(0))
    }
    // Finalmente, la matriz completa se devuelve como resultado.
    return matrix;

}



// Esta función crea y devuelve una matriz que representa una pieza del juego Tetris, basada en 
// el tipo especificado.
/**
 * Creates and returns a matrix representation of a Tetris piece based on the specified type.
 *
 * @param {string} type - The type of Tetris piece ('I', 'L', 'J', 'O', 'Z', 'S', 'T').
 * @returns {Array<Array<number>>} The matrix representing the specified Tetris piece type.
 */
function createPiece(type) {
    if (type === 'I') {
        // Retorna una matriz para la pieza "I"
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    } else if (type === 'L') {
        // Retorna una matriz para la pieza "L"
        return [
            [0, 2, 0],
            [0, 2, 0],
            [0, 2, 2],
        ];
    } else if (type === 'J') {
        // Retorna una matriz para la pieza "J"
        return [
            [0, 3, 0],
            [0, 3, 0],
            [3, 3, 0],
        ];
    } else if (type === 'O') {
        // Retorna una matriz para la pieza "O"
        return [
            [4, 4],
            [4, 4],
        ];
    } else if (type === 'Z') {
        // Retorna una matriz para la pieza "Z"
        return [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0],
        ];
    } else if (type === 'S') {
        // Retorna una matriz para la pieza "S"
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'T') {
        // Retorna una matriz para la pieza "T"
        return [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ];
    }
}




// Definición de la función drawMatrix que dibuja una matriz en un contexto de lienzo.
/**
 * Dibuja una matriz en un contexto de lienzo, representando valores como píxeles coloreados.
 * @param {number[][]} matrix - La matriz bidimensional que se va a dibujar.
 * @param {{x: number, y: number}} offset - El desplazamiento para ajustar las coordenadas de dibujo.
 * @param {CanvasRenderingContext2D} context - El contexto de dibujo del lienzo en el que se dibujará la matriz.
 * @param {string[]} colors - Un arreglo que contiene colores correspondientes a diferentes valores en la matriz.
 */

function drawMatrix(matrix, offset) {
    // Itera a través de cada fila (row) en la matriz.
    matrix.forEach((row, y) => {
        // Dentro de cada fila, itera a través de cada valor en la columna (column).
        row.forEach((value, x) => {
            // Verifica si el valor en la posición actual no es cero (0), lo que indica que debe dibujarse.
            if (value !== 0) {
                // Configura el color de relleno del contexto de dibujo según el valor actual.
                // Se asume que 'colors' es un objeto o matriz que almacena colores correspondientes a 
                // diferentes valores. 
                context.fillStyle = colors[value]; 
                
                // Dibuja un rectángulo de tamaño 1x1 en las coordenadas ajustadas 
                // (x + offset.x, y + offset.y) en el lienzo.
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}




/**
 * Dibuja los elementos del juego en el lienzo.
 * @function
 */
function draw() {
    /**
     * Establece el color de relleno del contexto de dibujo en negro.
     * @type {string}
     */
    context.fillStyle = '#000';

    /**
     * Dibuja un rectángulo negro en todo el lienzo para limpiar el contenido anterior.
     * @method fillRect
     * @param {number} x - Coordenada x de la esquina superior izquierda del rectángulo.
     * @param {number} y - Coordenada y de la esquina superior izquierda del rectángulo.
     * @param {number} width - Ancho del rectángulo.
     * @param {number} height - Alto del rectángulo.
     */
    context.fillRect(0, 0, canvas.width, canvas.height);

    /**
     * Dibuja la matriz 'arena' en el lienzo en la posición (0, 0).
     * @function drawMatrix
     * @param {Array<Array<number>>} matrix - La matriz a dibujar en el lienzo.
     * @param {Object} offset - Objeto con propiedades 'x' y 'y' para la posición en el lienzo.
     */
    drawMatrix(arena, {x: 0, y: 0});

    /**
     * Dibuja la matriz 'player.matrix' en el lienzo en la posición especificada por 'player.pos'.
     * @function drawMatrix
     * @param {Array<Array<number>>} matrix - La matriz a dibujar en el lienzo.
     * @param {Object} position - Objeto con propiedades 'x' y 'y' para la posición en el lienzo.
     */
    drawMatrix(player.matrix, player.pos);
}


/**
 * Combina la matriz del jugador con la matriz de la arena en las posiciones adecuadas.
 * @param {Array} arena - La matriz que representa la arena de juego.
 * @param {Object} player - El objeto que contiene la matriz del jugador y su posición.
 */
function merge(arena, player){
    // Itera a través de cada fila en la matriz del jugador
    player.matrix.forEach((row, y) => {
        // Para cada celda en la fila actual del jugador
        row.forEach((value, x) =>{
            // Si el valor de la celda no es cero (es una parte de la pieza)
            if(value !== 0){
                // Calcula las coordenadas absolutas en la arena sumando la posición del jugador
                // a las coordenadas relativas de la celda actual en la matriz del jugador

                // Asigna el valor de la celda de la matriz del jugador a la posición correspondiente
                // en la matriz de la arena para fusionar la pieza del jugador con la arena.
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}



/**
 * Esta función rota una matriz cuadrada en 90 grados en el sentido de las agujas del reloj
 * o en sentido contrario a las agujas del reloj, según la dirección proporcionada.
 *
 * @param {Array<Array<any>>} matrix - La matriz que se va a rotar.
 * @param {number} dir - La dirección de rotación: 1 para rotación en sentido de las agujas del reloj,
 *                       -1 para rotación en sentido contrario a las agujas del reloj.
 * 
 * >>> rotate(exampleMatrix, 1);
 * >>> console.log(exampleMatrix); // Resultado esperado: [[7, 4, 1], [8, 5, 2], [9, 6, 3]]
 */
function rotate(matrix, dir) {
    // Se recorre la matriz en su parte triangular superior.
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            // Se intercambian los elementos de la posición (x, y) y (y, x) en la matriz.
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }

    // Se verifica la dirección de rotación.
    if (dir > 0) {
        // Si la dirección es positiva (sentido de las agujas del reloj),
        // se invierte el orden de los elementos en cada fila de la matriz.
        matrix.forEach((row) => row.reverse());
    } else {
        // Si la dirección es negativa (sentido contrario a las agujas del reloj),
        // se invierte el orden de las filas en la matriz.
        matrix.reverse();
    }
}



// Esta función se encarga de manejar la caída de una pieza en el juego.
function playDrop() {
    // Incrementa la posición vertical (y) del jugador en una unidad, simulando la caída.
    player.pos.y++;

    // Verifica si la pieza del jugador colisiona con la arena.
    if (collide(arena, player)) {
        // Si hay una colisión, retrocede la posición vertical del jugador en una unidad.
        player.pos.y--;

        // Fusiona la pieza del jugador con la arena existente.
        merge(arena, player);

        // Reinicia la posición del jugador a la parte superior para una nueva pieza.
        playerReset();

        // Realiza un barrido en la arena para eliminar filas completas si las hay.
        arenaSweep();

        // Actualiza la puntuación del juego en caso de que se hayan eliminado filas.
        updateScore();
    }

    // Reinicia el contador de caída, ya que el jugador ha realizado una acción.
    dropCounter = 0;
}




// Función que mueve al jugador en el eje vertical y maneja colisiones

// La función 'playerMove' toma un parámetro 'offset', que indica cuánto mover al jugador en el eje vertical.

// La variable 'player' se asume que está definida en algún lugar del código, representando al jugador.
// 'player.pos' probablemente almacena la posición actual del jugador con propiedades 'x' e 'y'.

// La función 'collide' se utiliza para verificar si hay colisión entre el jugador y el área de juego ('arena').
// Si retorna 'true', significa que hay colisión, por lo que el jugador se mueve hacia atrás en el 
// eje horizontal para evitar la colisión.

// Este código asume la existencia de las variables 'player', 'player.pos', 'arena' y la función 'collide'.
function playerMove(offset) {
    // Aumenta la posición vertical del jugador por el valor de 'offset'
    player.pos.x += offset;

    // Verifica si hay colisión entre el jugador y el área de juego (arena)
    if (collide(arena, player)) {
        // Si hay colisión, ajusta la posición horizontal del jugador para deshacer el movimiento
        player.pos.x -= offset;
    }
}



/**
 * Reinicia el estado del jugador y la posición de la pieza.
 */
function playerReset() {
    // Definición de las diferentes piezas en forma de cadenas.
    const pieces = 'TJLOSZI';

    // Selecciona una pieza aleatoria de 'pieces' y la asigna a la matriz de la pieza del jugador.
    player.matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);

    // Restablece la posición vertical (y) del jugador al principio del área de juego.
    player.pos.y = 0;

    // Calcula la posición horizontal (x) del jugador para que la pieza aparezca en el centro del área de juego.
    player.pos.x = ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);

    // Verifica si la pieza del jugador colisiona con la arena existente.
    if (collide(arena, player)) {
        // Si hay colisión, se reinicia la arena llenando todas las filas con ceros.
        arena.forEach((row) => row.fill(0));

        // También se reinicia la puntuación del jugador.
        player.score = 0;

        // Actualiza la puntuación en la interfaz de usuario.
        updateScore();
    }
}




// Esta función rota la matriz del jugador y ajusta su posición si hay colisiones.
/**
 * Esta función rota la matriz de la pieza del jugador y ajusta su posición si hay colisiones con la arena.
 * @param {number} dir - La dirección de rotación (1 o -1).
 */
function playerRotate(dir) {
    const pos = player.pos.x; // Guarda la posición actual del jugador en el eje x.
    let offset = 1; // Inicializa el desplazamiento.

    rotate(player.matrix, dir); // Rota la matriz del jugador en la dirección especificada.

    // Comprueba si hay colisión entre la matriz del jugador y la arena.
    while (collide(arena, player)) {
        player.pos.x += offset; // Ajusta la posición del jugador en el eje x.

        // Alterna el valor de offset y cambia su signo.
        offset = -(offset + (offset > 0 ? 1 : -1));

        // Si el desplazamiento supera el ancho de la matriz del jugador, revierte la rotación y la posición.
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir); // Revierte la rotación.
            player.pos.x = pos; // Restaura la posición original del jugador.
            return; // Sale de la función.
        }
    }
}



// Creación de las variables

// Declaración de variables para el contador de caídas, el intervalo entre caídas y el tiempo del último frame.
let dropCounter = 0; // Contador de tiempo para controlar cuándo dejar caer un objeto.
let dropInterval = 1000; // Intervalo de tiempo en milisegundos entre caídas.
let lastTime = 0; // Almacena el tiempo del último frame procesado.


// Función de actualización que se llama en cada frame.
function update(time = 0) {
    // Calcula el tiempo transcurrido desde el último frame.
    const deltaTime = time - lastTime;

    // Incrementa el contador de tiempo para la próxima caída.
    dropCounter += deltaTime;

    // Verifica si el contador supera el intervalo establecido para una nueva caída.
    if (dropCounter > dropInterval) {
        playDrop(); // Llama a la función playDrop() para simular una caída.
    }

    // Actualiza el valor del último tiempo procesado.
    lastTime = time;

    draw(); // Llama a la función draw() para dibujar la escena actual.

    // Solicita la siguiente animación de frame llamando recursivamente a la función update.
    requestAnimationFrame(update);
}



// Esta función actualiza el marcador en el documento HTML con el valor del puntaje del jugador.
function updateScore(){
    document.getElementById('score').innerText = 'Score: ' + player.score;
}
// Agrega un escuchador de eventos al documento que se activa cuando se presiona una tecla.
document.addEventListener('keydown', (event) => {
    // Comprueba si la tecla presionada es la tecla J (código 74).
    if (event.keyCode === 37) {
        // Si es así, llama a la función playerMove con un argumento de -1 para mover a la izquierda.
        playerMove(-1);
    } else if (event.keyCode === 39) {
        // Comprueba si la tecla presionada es la tecla L (código 76).
        // Si es así, llama a la función playerMove con un argumento de 1 para mover a la derecha.
        playerMove(1);
    } else if (event.keyCode === 40) {
        // Comprueba si la tecla presionada es la tecla abajo (código 40).
        // Si es así, llama a la función playDrop.
        playDrop();
    } else if (event.keyCode === 81) {
        // Comprueba si la tecla presionada es 'Q' (código 81).
        // Si es así, llama a la función playerRotate con un argumento de -1.
        playerRotate(-1);
    } else if (event.keyCode === 87) {
        // Comprueba si la tecla presionada es 'W' (código 87).
        // Si es así, llama a la función playerRotate con un argumento de 1.
        playerRotate(1);
    }
});



// Definición de colores utilizados en el juego.
const colors = [
    null,        // El índice 0 representa celdas vacías, por lo tanto, se establece como 'null'.
    '#013C61',   // Colores en formato hexadecimal para representar diferentes elementos del juego.
    '#47A9E6',
    '#038CE0',
    '#1E4761',
    '#026CAD',
    '#7EA2E6',
    '#A3ADBF'
];


// Creación de la matriz 'arena' con dimensiones 12x20 (12 filas y 20 columnas).
// Se asume que la función 'createMatrix' está definida en otro lugar del código.
const arena = createMatrix(20, 25);  


// Definición del jugador (player) como un objeto.
// Posición inicial del jugador en la matriz.
// Matriz que representa la forma actual del jugador. Se asume que se asignará más adelante.
// Puntuación del jugador.
const player = {
    pos: { x: 0, y: 0 },  
    matrix: null,         
    score: 0              
};


playerReset()
updateScore()
update()
