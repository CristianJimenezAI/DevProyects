


// Variables para realizar cálculos y almacenar datos temporales
let runningTotal = 0; // Almacena el total acumulado de las operaciones
let buffer = '0'; // Almacena el número en el que se está trabajando actualmente
let previosOperator; // Almacena el operador anterior

// Elemento en el que se mostrará la pantalla de la calculadora
const screen = document.querySelector('.screen');

// Función que se ejecuta cuando se hace clic en un botón
function buttonClick(value) {
    if (isNaN(value)) {
        handleSymbol(value); // Si el valor no es un número, se trata como un símbolo
    } else {
        handleNumber(value); // Si es un número, se maneja como tal
    }
    screen.innerText = buffer; // Se muestra el contenido del buffer en la pantalla
}

// Función para manejar los símbolos de la calculadora
function handleSymbol(symbol) {
    switch (symbol) {
        case 'C':
            buffer = '0'; // Reinicia el buffer a 0
            runningTotal = 0; // Reinicia el total acumulado
            break;
        case '=':
            if (previosOperator === null) {
                return; // Si no hay operador anterior, no se realiza nada
            }
            flushOperation(parseInt(buffer)); // Realiza la operación pendiente
            previosOperator = null; // Reinicia el operador anterior
            buffer = runningTotal; // Muestra el total acumulado en el buffer
            runningTotal = 0; // Reinicia el total acumulado
            break;
        case '←':
            if (buffer.length === 1) {
                buffer = '0'; // Si solo hay un dígito, se reinicia el buffer a 0
            } else {
                buffer = buffer.substring(0, buffer.length - 1); // Elimina el último dígito
            }
            break;
        case '+':
        case '−':
        case '×':
        case '÷':
            handleMath(symbol); // Maneja las operaciones matemáticas
            break;
    }
}

// Función para manejar las operaciones matemáticas
function handleMath(symbol) {
    if (buffer === '0') {
        return; // Si el buffer es 0, no se realiza ninguna operación
    }

    const intBuffer = parseInt(buffer);

    if (runningTotal === 0) {
        runningTotal = intBuffer; // Si no hay total acumulado, se establece el valor actual
    } else {
        flushOperation(intBuffer); // Si hay total acumulado, se realiza la operación pendiente
    }
    previosOperator = symbol; // Se almacena el operador actual como previo
    buffer = '0'; // Se reinicia el buffer para el siguiente número
}

// Función para realizar la operación pendiente
function flushOperation(intBuffer) {
    if (previosOperator === '+') {
        runningTotal += intBuffer;
    } else if (previosOperator === '−') {
        runningTotal -= intBuffer;
    } else if (previosOperator === '×') {
        runningTotal *= intBuffer;
    } else if (previosOperator === '÷') {
        runningTotal /= intBuffer;
    }
}

// Función para manejar los números
function handleNumber(numberString) {
    if (buffer === '0') {
        buffer = numberString; // Si el buffer es 0, se reemplaza con el número
    } else {
        buffer += numberString; // Si hay dígitos en el buffer, se concatena el número
    }
}

// Función para inicializar la calculadora al cargar la página
function init() {
    // Se agrega un event listener al contenedor de los botones de la calculadora
    document.querySelector('.calc-buttons').addEventListener('click', function(event) {
        buttonClick(event.target.innerText); // Se llama a buttonClick con el valor del botón clickeado
    });
}

init(); // Se llama a la función init para iniciar la calculadora
