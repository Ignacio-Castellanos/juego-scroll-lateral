let player = document.getElementById('player'); // Elemento del jugador  
let scoreDisplay = document.getElementById('score'); // Elemento que muestra el puntaje
let gameOverScreen = document.getElementById('game-over'); // Pantalla de Game Over
let restartButton = document.getElementById('restart'); // Botón para reiniciar el juego
let startButton = document.getElementById('start-game'); // Botón para iniciar el juego


// Variables del juego
let score = 0; // Puntaje inicial
let playerSpeed = 10; // Velocidad del jugador
let enemySpeed = 3; // Velocidad inicial de los enemigos
let enemies = []; // Arreglo para almacenar los enemigos
let gameOver = false; // Bandera para indicar si el juego ha terminado
let spawnInterval = 2000; // Intervalo inicial para la aparición de enemigos (en milisegundos)
let speedIncreaseRate = 0.03; // Incremento lento de la velocidad de los enemigos
let speedIncreaseInterval = 60000; // Intervalo en milisegundos para aumentar la velocidad de los enemigos

// Elemento de audio para la música de fondo
let backgroundMusic = document.getElementById('background-music');

// Escucha los eventos de teclado para mover al jugador
document.addEventListener('keydown', (e) => {
    if (gameOver) return; // Si el juego ha terminado, no hacer nada

    switch (e.key) {
        case 'ArrowLeft': // Si se presiona la tecla de flecha izquierda
            movePlayer(-playerSpeed, 0); // Mover al jugador a la izquierda
            break;
        case 'ArrowRight': // Si se presiona la tecla de flecha derecha
            movePlayer(playerSpeed, 0); // Mover al jugador a la derecha
            break;
        case 'ArrowUp': // Si se presiona la tecla de flecha arriba
            movePlayer(0, -playerSpeed); // Mover al jugador hacia arriba
            break;
        case 'ArrowDown': // Si se presiona la tecla de flecha abajo
            movePlayer(0, playerSpeed); // Mover al jugador hacia abajo
            break;
    }
});

// Función para iniciar el juego
function startGame() {
    // Reproduce la música de fondo, manejando posibles errores
    backgroundMusic.play().catch(error => {
        console.error('Error al reproducir la música: ', error);
    });
    // Comienza a generar enemigos
    startSpawningEnemies();
    // Oculta el botón de inicio después de iniciar el juego
    startButton.style.display = 'none';
}

// Función para mover al jugador
function movePlayer(x, y) {
    let newLeft = player.offsetLeft + x; 
    let newTop = player.offsetTop + y; 

    
    newLeft = Math.max(0, Math.min(window.innerWidth - player.clientWidth, newLeft));
    newTop = Math.max(0, Math.min(window.innerHeight - player.clientHeight, newTop));

    player.style.left = newLeft + 'px'; 
    player.style.top = newTop + 'px'; 
    
    checkCollision();
}


function checkCollision() {
    let playerRect = player.getBoundingClientRect(); 

    enemies.forEach((enemy, index) => {
        let enemyRect = enemy.getBoundingClientRect(); 

        
        if (
            playerRect.right >= enemyRect.left &&
            playerRect.left <= enemyRect.right &&
            playerRect.bottom >= enemyRect.top &&
            playerRect.top <= enemyRect.bottom
        ) {
            
            enemy.remove();
            enemies.splice(index, 1); 
            score += 10; 
            updateScore(); 
        }
    });
}


function updateScore() {
    scoreDisplay.textContent = `Puntos: ${score}`; // Corregido con comillas invertidas
}



function spawnEnemy() {
    let enemy = document.createElement('div'); 
    enemy.className = 'enemy'; 
    enemy.style.top = ${Math.random() * (window.innerHeight - 80)}px; 
    enemy.style.left = ${window.innerWidth}px; 
    document.getElementById('game-container').appendChild(enemy);

    enemies.push(enemy); 
    moveEnemy(enemy); 
}


function moveEnemy(enemy) {
    let enemyInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(enemyInterval); 
            return;
        }

        let enemyPosition = enemy.offsetLeft; 
        if (enemyPosition < -50) {
            
            clearInterval(enemyInterval); // Detiene el intervalo de movimiento del enemigo
            triggerGameOver(); // Llama a la función de fin de juego
        } else {
            enemy.style.left = enemyPosition - enemySpeed + 'px'; // Mueve el enemigo a la izquierda
        }

        // Verifica si el enemigo ha colisionado con el jugador
        checkCollision();
    }, 20); // Ejecuta cada 20 milisegundos
}

// Función que maneja el fin del juego
function triggerGameOver() {
    gameOver = true; // Establece la bandera de fin de juego
    backgroundMusic.pause(); // Pausa la música de fondo
    gameOverScreen.style.display = 'block'; // Muestra la pantalla de Game Over
    enemies.forEach(e => e.remove()); // Elimina todos los enemigos de la pantalla
}

// Función para reiniciar el juego
function restartGame() {
    score = 0; // Restablece el puntaje
    updateScore(); // Actualiza la visualización del puntaje
    gameOver = false; // Restablece la bandera de fin de juego
    gameOverScreen.style.display = 'none'; // Oculta la pantalla de Game Over
    document.querySelectorAll('.enemy').forEach(e => e.remove()); // Elimina todos los enemigos de la pantalla
    enemies = []; // Restablece el arreglo de enemigos
    enemySpeed = 2; // Restablece la velocidad inicial de los enemigos
    spawnInterval = 2000; // Restablece el intervalo de aparición de enemigos
    backgroundMusic.play().catch(error => {
        console.error('Error al reproducir la música: ', error);
    }); // Reanuda la música si fue pausada
    startSpawningEnemies(); // Reinicia la generación de enemigos
}

// Función para comenzar a generar enemigos
function startSpawningEnemies() {
    // Intervalo para generar enemigos
    let spawnEnemyInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(spawnEnemyInterval); // Detiene la generación de enemigos si el juego ha terminado
            return;
        }

        spawnEnemy(); 
    }, spawnInterval);

    
    setInterval(() => {
        if (!gameOver) {
            enemySpeed += speedIncreaseRate; 
        }
    }, speedIncreaseInterval);
}


restartButton.addEventListener('click', restartGame);


startButton.addEventListener('click', () => {
    startGame(); 
});

