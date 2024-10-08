const startScreen = document.getElementById('start-screen');
const gameBoardContainer = document.getElementById('game-board-container');
const gameBoard = document.getElementById('game-board');
const startButton = document.getElementById('start-game');
const winModal = document.getElementById('win-modal');
const winMessage = document.getElementById('win-message');
const replayButton = document.getElementById('replay-game');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedPairs = 0;
let moves = 0;

// Liste des images pour les cartes
const cardImages = [
    'img1.png', 'img2.png', 'img3.png', 'img4.png', 'img5.png',
    'img6.png', 'img7.png', 'img8.png', 'img9.png', 'img10.png'
];

// Double les images pour créer des paires
let cardsArray = [...cardImages, ...cardImages];

/**
 * Mélange les cartes de manière aléatoire.
 * @param {Array} array - Le tableau des cartes à mélanger.
 * @returns {Array} - Le tableau mélangé.
 */
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

/**
 * Initialisation du jeu à partir de l'écran de démarrage.
 */
startButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    gameBoardContainer.classList.remove('hidden');
    initGame();
});

/**
 * Initialise le plateau de jeu et mélange les cartes.
 */
function initGame() {
    matchedPairs = 0;
    moves = 0;
    gameBoard.innerHTML = '';
    winModal.classList.add('hidden');
    cardsArray = shuffle(cardsArray);

    // Créer les cartes et les ajouter au plateau
    cardsArray.forEach((image, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = image;
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back" style="background-image: url('images/${image}')"></div>
            </div>
        `;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });

    // Afficher les cartes pendant 15 secondes avant de les retourner
    setTimeout(() => {
        document.querySelectorAll('.card').forEach(card => card.classList.add('flip'));
        setTimeout(() => {
            document.querySelectorAll('.card').forEach(card => card.classList.remove('flip'));
        }, 15000);
    }, 1000);
}

/**
 * Gère le retournement des cartes.
 */
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    moves++;
    checkForMatch();
}

/**
 * Vérifie si les deux cartes sélectionnées sont identiques.
 */
function checkForMatch() {
    let isMatch = firstCard.dataset.image === secondCard.dataset.image;
    isMatch ? disableCards() : unflipCards();
}

/**
 * Désactive les cartes si elles sont identiques.
 */
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    matchedPairs++;
    resetBoard();

    if (matchedPairs === cardImages.length) {
        setTimeout(showWinMessage, 500);
    }
}

/**
 * Retourne les cartes si elles ne correspondent pas.
 */
function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

/**
 * Réinitialise l'état du plateau.
 */
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

/**
 * Affiche un message de victoire avec le nombre de coups.
 */
function showWinMessage() {
    winMessage.textContent = `Félicitations ! Vous avez trouvé toutes les paires en ${moves} coups !`;
    winModal.classList.remove('hidden');
}

/**
 * Redémarre le jeu.
 */
replayButton.addEventListener('click', initGame);
