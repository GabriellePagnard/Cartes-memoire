// Variables nécessaires pour le jeu
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

// Liste des images pour les cartes (à personnaliser avec vos images)
const cardImages = [
    'img1.png', 'img2.png', 'img3.png', 'img4.png', 'img5.png',
    'img6.png', 'img7.png', 'img8.png', 'img9.png', 'img10.png'
];

// Double les images pour créer des paires
let cardsArray = [...cardImages, ...cardImages];

// Mélanger les cartes aléatoirement
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Initialisation du jeu
startButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    gameBoardContainer.classList.remove('hidden');
    initGame();
});

// Initialisation du plateau de jeu
function initGame() {
    matchedPairs = 0;
    moves = 0;
    gameBoard.innerHTML = '';
    winModal.classList.add('hidden');
    cardsArray = shuffle(cardsArray);

    // Créer les éléments de carte et les ajouter au plateau
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

    // Afficher toutes les cartes pendant 15 secondes, puis les cacher
    setTimeout(() => {
        document.querySelectorAll('.card').forEach(card => card.classList.add('flip'));
        setTimeout(() => {
            document.querySelectorAll('.card').forEach(card => card.classList.remove('flip'));
        }, 15000);
    }, 1000);
}

// Gérer le retournement des cartes
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        // Première carte cliquée
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Deuxième carte cliquée
    secondCard = this;
    moves++;
    checkForMatch();
}

// Vérifier si les cartes correspondent
function checkForMatch() {
    let isMatch = firstCard.dataset.image === secondCard.dataset.image;
    isMatch ? disableCards() : unflipCards();
}

// Désactiver les cartes si elles correspondent
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    matchedPairs++;
    resetBoard();

    // Vérifier si toutes les paires sont trouvées
    if (matchedPairs === cardImages.length) {
        setTimeout(showWinMessage, 500);
    }
}

// Retourner les cartes si elles ne correspondent pas
function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

// Réinitialiser l'état du plateau
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Afficher un message de victoire avec le nombre de coups
function showWinMessage() {
    winMessage.textContent = `Félicitations ! Vous avez trouvé toutes les paires en ${moves} coups !`;
    winModal.classList.remove('hidden');
}

// Redémarrer le jeu en cliquant sur le bouton "Rejouer"
replayButton.addEventListener('click', initGame);
