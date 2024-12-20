import Deck from './Deck.js';
import Board from './Board.js';
import Renderer from './Renderer.js';
import InputHandler from './InputHandler.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const deck = new Deck();
const board = new Board(deck);
const renderer = new Renderer(ctx, canvas);
let message = '';
let messageColor = '';
let messageTimeout = null;

new InputHandler(board, () => {
    if (board.hasAvailableSet()) {
        board.replaceSelectedCards();
    }
}, displayMessage, findSets, );

function gameLoop() {
    renderer.drawBoard(board);
    requestAnimationFrame(gameLoop);
}

gameLoop();
    

function findSets(cards) {
    const isSet = (card1, card2, card3) => {
        const allSameOrAllDifferent = (prop) =>
            (card1[prop] === card2[prop] && card2[prop] === card3[prop]) ||
            (card1[prop] !== card2[prop] && card2[prop] !== card3[prop] && card1[prop] !== card3[prop]);
        return (
            allSameOrAllDifferent('shape') &&
            allSameOrAllDifferent('color') &&
            allSameOrAllDifferent('shading') &&
            allSameOrAllDifferent('number')
        );
    };

    const sets = [];
    for (let i = 0; i < cards.length - 2; i++) {
        for (let j = i + 1; j < cards.length - 1; j++) {
            for (let k = j + 1; k < cards.length; k++) {
                if (isSet(cards[i], cards[j], cards[k])) {
                    sets.push([cards[i], cards[j], cards[k]]);
                }
            }
        }
    }
    return sets;
}

function displayMessage(msg, color) {
    message = msg;
    messageColor = color;
    if (messageTimeout) {
        clearTimeout(messageTimeout);
    }
    messageTimeout = setTimeout(() => {
        message = '';
        messageColor = '';
    }, 2000);
}

function drawMessage() {
    if (message) {
        ctx.fillStyle = messageColor;
        ctx.font = '24px Arial';
        ctx.fillText(message, 10, 30);
    }
}