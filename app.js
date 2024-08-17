// Sélection des éléments HTML nécessaires
const gameBoard = document.getElementById('game-board');
const messageModal = document.getElementById('message-modal');
const messageText = document.getElementById('message');
const closeModalBtn = document.getElementById('close-modal');
const restartBtn = document.getElementById('restart-btn');

// Variables pour gérer l'état du jeu
let cardsArray = [];
let flippedCards = [];
let matchedPairs = 0;
const totalPairs = 10;

// Liste des symboles pour les paires de cartes (10 symboles différents)
const cardSymbols = ['🍕', '🍔', '🍟', '🍣', '🍩', '🍦', '🍇', '🍉', '🍌', '🍒'];

/**
 * Mélange un tableau de manière aléatoire.
 * @param {Array} array - Le tableau à mélanger.
 * @returns {Array} - Le tableau mélangé.
 */
function shuffle(array) {
    return array.sort(() => 0.5 - Math.random());
}

/**
 * Génère les cartes pour le jeu et les ajoute à la grille.
 */
function initializeGame() {
    // Réinitialiser l'état du jeu
    gameBoard.innerHTML = '';
    cardsArray = [];
    flippedCards = [];
    matchedPairs = 0;

    // Créer un tableau de cartes (chaque symbole est en double)
    const symbols = [...cardSymbols, ...cardSymbols];
    const shuffledSymbols = shuffle(symbols);

    // Créer les éléments de carte et les ajouter à la grille
    shuffledSymbols.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol;
        card.innerHTML = `
            <div class="card-content card-back"></div>
            <div class="card-content card-front">${symbol}</div>
        `;
        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
        cardsArray.push(card);
    });

    // Afficher les cartes face visible pendant 15 secondes
    cardsArray.forEach(card => card.classList.add('flipped'));
    setTimeout(() => {
        cardsArray.forEach(card => card.classList.remove('flipped'));
    }, 15000); // 15 secondes
}

/**
 * Gère le retournement des cartes.
 * @param {HTMLElement} card - La carte cliquée.
 */
function flipCard(card) {
    // Ne rien faire si la carte est déjà retournée ou si plus de 2 cartes sont retournées
    if (flippedCards.length >= 2 || card.classList.contains('flipped')) return;

    // Retourner la carte
    card.classList.add('flipped');
    flippedCards.push(card);

    // Vérifier si deux cartes sont retournées
    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

/**
 * Vérifie si les deux cartes retournées sont identiques.
 */
function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.symbol === card2.dataset.symbol) {
        matchedPairs++;
        flippedCards = [];
        showTemporaryMessage('Bravo !');
        if (matchedPairs === totalPairs) {
            showEndMessage('Félicitations, vous avez trouvé toutes les paires !');
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000); // Délai avant de retourner les cartes (1 seconde)
    }
}

/**
 * Affiche un message temporaire au joueur.
 * @param {string} message - Le message à afficher.
 */
function showTemporaryMessage(message) {
    messageText.textContent = message;
    messageModal.classList.remove('hidden');
    setTimeout(() => {
        messageModal.classList.add('hidden');
    }, 1000); // Afficher le message pendant 1 seconde
}

/**
 * Affiche un message de fin de partie (victoire ou échec).
 * @param {string} message - Le message à afficher.
 */
function showEndMessage(message) {
    messageText.textContent = message;
    messageModal.classList.remove('hidden');
    restartBtn.classList.remove('hidden');
}

/**
 * Ferme la fenêtre modale.
 */
closeModalBtn.addEventListener('click', () => {
    messageModal.classList.add('hidden');
});

/**
 * Redémarre le jeu lorsque l'utilisateur clique sur "Rejouer".
 */
restartBtn.addEventListener('click', () => {
    restartBtn.classList.add('hidden');
    initializeGame();
});

// Initialiser le jeu au chargement de la page
initializeGame();
