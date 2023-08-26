// Declaración de variables globales
var playerTurn, moves, isGameOver, span, restartButton;

// Inicialización de variables
playerTurn = "x"; // Jugador actual (inicia con "x")
moves = 0; // Contador de movimientos
isGameOver = false; // Bandera para verificar si el juego ha terminado
span = document.getElementsByTagName("span"); // Obtiene todas las celdas del tablero
restartButton = '<button onclick="playAgain()"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16"><path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/><path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/></svg></button>'; // Botón de reinicio con icono SVG

// Función que maneja el turno del jugador y verifica el estado del juego
function play(y) {
    if (y.dataset.player == "none" && window.isGameOver == false) {
        y.innerHTML = playerTurn; // Marca la celda con el símbolo del jugador actual
        y.dataset.player = playerTurn; // Actualiza el jugador de la celda
        moves++; // Incrementa el contador de movimientos

        // Cambia el turno del jugador
        if (playerTurn == "x") {
            playerTurn = "o";
        } else if (playerTurn == "o") {
            playerTurn = "x";
        }
    }

    // Verifica si hay un ganador
    checkWinner(1, 2, 3);
    // ... Verifica otros posibles patrones de victoria ...
    // Verifica si no hay ganador pero el juego está en empate
    if (moves == 9 && isGameOver == false) { draw(); }
}

// Función para verificar si hay un ganador según patrones predefinidos
function checkWinner(a, b, c) {
    a--;
    b--;
    c--;
    if ((span[a].dataset.player === span[b].dataset.player) && (span[b].dataset.player === span[c].dataset.player) && (span[a].dataset.player === span[c].dataset.player) && (span[a].dataset.player === "x" || span[a].dataset.player === "o") && isGameOver == false) {
        // Si se cumplen las condiciones de victoria, resalta las celdas ganadoras y llama a gameOver()
        span[a].parentNode.className += " activeBox";
        span[b].parentNode.className += " activeBox";
        span[c].parentNode.className += " activeBox";
        gameOver(a);
    }
}

// Función para reiniciar el juego
function playAgain() {
    // Elimina el mensaje de finalización del juego
    document.getElementsByClassName("alert")[0].parentNode.removeChild(document.getElementsByClassName("alert")[0]);
    // Reinicia el juego
    resetGame();
    window.isGameOver = false;
    // Remueve las clases de resaltado de las celdas
    for (var k = 0; k < span.length; k++) {
        span[k].parentNode.className = span[k].parentNode.className.replace("activeBox", "");
    }
}

// Función para restablecer el juego a su estado inicial
function resetGame() {
    for (i = 0; i < span.length; i++) {
        span[i].dataset.player = "none";
        span[i].innerHTML = "&nbsp;";
    }
    playerTurn = "x"; // Reinicia el turno al jugador "x"
}

// Función para mostrar el mensaje de fin de juego en caso de victoria
function gameOver(a) {
    var gameOverAlertElement = "..."; // Mensaje de victoria con botón de reinicio
    var div = document.createElement("div");
    div.className = "alert";
    div.innerHTML = gameOverAlertElement;
    document.getElementsByTagName("body")[0].appendChild(div);
    window.isGameOver = true;
    moves = 0; // Reinicia el contador de movimientos
}

// Función para mostrar el mensaje de empate
function draw() {
    var drawAlertElement = "..."; // Mensaje de empate con botón de reinicio
    var div = document.createElement("div");
    div.className = "alert";
    div.innerHTML = drawAlertElement;
    document.getElementsByTagName("body")[0].appendChild(div);
    window.isGameOver = true;
    moves = 0; // Reinicia el contador de movimientos
}
