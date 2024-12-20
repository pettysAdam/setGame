const canv = document.getElementById('myCanvas');
const ctx = canv.getContext('2d');

const cardWidth = 150;
const cardHeight = 100;
const cardGap = 10;

const shapes = ['circle', 'square', 'diamond'];
const colors = ['#FF6666', '#CC99FF', '#00FF7F']; // Red, Purple, Green
const shadings = ['solid', 'striped', 'stroke'];

let message = '';
let messageColor = '';
let messageTimeout = null;

// Generates all cards
const cards = [];
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
            for (let l = 1; l < 4; l++) {
                cards.push({
                    shape: shapes[i],
                    color: colors[j],
                    shading: shadings[k],
                    number: l
                });
            }
        }
    }
}

// Shuffles cards
for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
}

// Calculate the total width and height of the grid of cards
const totalWidth = 3 * cardWidth + 2 * cardGap;
const totalHeight = 4 * cardHeight + 3 * cardGap;

// Calculate the starting x and y coordinates to center the grid
const startX = (canv.width - totalWidth) / 2;
const startY = 5;

// Display top 12 cards with 4 rows and 3 columns
let indexInTheDeck = 12;
const displayedCards = cards.slice(0, indexInTheDeck);

const sets = findSets(displayedCards);
console.log(sets);

const indexesSelected = Array(18).fill(0);
// Map valid keys to corresponding indexes
const keyToIndexMap = {
    '1': 0, '2': 1, '3': 2, 'q': 3, 'w': 4,
    'e': 5, 'a': 6, 's': 7, 'd': 8, 'z': 9,
    'x': 10, 'c': 11, '4': 12, '5': 13, '6': 14,
    'r': 15, 't': 16, 'y': 17, 'f': 18, 'g': 19, 'h': 20
};

document.addEventListener('keydown', function (event) {
    if (keyToIndexMap.hasOwnProperty(event.key)) {
        const index = keyToIndexMap[event.key];
        if (index >= displayedCards.length) {
            return;
        }
        indexesSelected[index] = indexesSelected[index] === 0 ? 1 : 0;
        if (indexesSelected.filter(x => x === 1).length === 3) {
            const selectedCards = indexesSelected.map(
                (x, i) => x === 1 ? displayedCards[i] : null
            ).filter(x => x !== null);

            if (findSets(selectedCards).length > 0) {
                drawNext3Cards(true);
                displayMessage("Valid Set!", "green");
            } else {
                displayMessage("That's not a set!", "red");
            }
            indexesSelected.fill(0);
        }
        drawCards();
    }
    if (event.key === 'p' && displayedCards.length < 18) {
        //drawNext3Cards(false);
    }
});

function draw() {
    ctx.clearRect(0, 0, canv.width, canv.height); // Clear the canvas
    drawCards();
    drawMessage();
    requestAnimationFrame(draw);
}

function drawCards() {
    const firstSet = sets.length > 0 ? sets[0] : null;
    for (let i = 0; i < displayedCards.length; i++) {
        const isSelected = indexesSelected[i] === 1;
        const card = displayedCards[i];
        const x = startX + (i % 3) * (cardWidth + cardGap);
        const y = startY + Math.floor(i / 3) * (cardHeight + cardGap);
        //const fillCardWithSet = firstSet && firstSet.includes(card);
        drawCard(x, y, card, isSelected);
    }
}

function drawCard(x, y, card, isSelected, fillCardWithSet=false) {
    drawCardBorder(x, y, isSelected, fillCardWithSet);

    const shape = card.shape;
    const color = card.color;
    const shading = card.shading;
    const number = card.number;
    const size = 36; // Adjust this value to change the size of the shapes

    const shapeFunc = {
        circle: drawCircle,
        square: drawSquare,
        diamond: drawDiamond
    }[shape];

    const totalWidth = number * size + (number - 1) * 10;
    const startX = x + (cardWidth - totalWidth) / 2;
    const startY = y + (cardHeight - size) / 2;

    ctx.lineWidth = 3;
    for (let i = 0; i < number; i++) {
        shapeFunc(startX + i * (size + 10), startY, color, shading, size);
    }
    ctx.lineWidth = 1;
}

function drawNext3Cards(replaceSelectedCards) {
    if (replaceSelectedCards && displayedCards.length > 12) {
        // If there are more than 12 cards displayed, just remove the selected cards
        for (let i = 0; i < indexesSelected.length; i++) {
            if (indexesSelected[i] === 1) {
                displayedCards.splice(i, 1);
            }
        }
        indexesSelected.fill(0);
        return;
    }

    const remainingCards = cards.length - indexInTheDeck;
    const cardsToDraw = Math.min(3, remainingCards); // Draw up to 3 cards, but not more than remaining

    if (cardsToDraw === 0) {
        displayMessage("No more cards in the deck!", "red");
        return;
    }

    const next3Cards = cards.slice(indexInTheDeck, indexInTheDeck + cardsToDraw);
    indexInTheDeck += cardsToDraw;

    if (replaceSelectedCards) {
        // Replaces the selected cards that are displayed with the next 3 cards
        for (let i = 0; i < indexesSelected.length; i++) {
            if (indexesSelected[i] === 1 && next3Cards.length > 0) {
                displayedCards[i] = next3Cards.shift();
            }
        }
    } else { // Adds the next 3 cards to the displayed cards
        displayedCards.push(...next3Cards);
    }

    indexesSelected.fill(0); // Reset the selection
}

function darkenColor(color) {
    const factor = 0.5; // Lower is darker
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const newR = Math.max(0, Math.min(255, Math.floor(r * factor)));
    const newG = Math.max(0, Math.min(255, Math.floor(g * factor)));
    const newB = Math.max(0, Math.min(255, Math.floor(b * factor)));
    return `rgb(${newR}, ${newG}, ${newB})`;
}

function drawCircle(x, y, color, shading, size) {
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.strokeStyle = shading == 'solid' ? darkenColor(color) : color;
    ctx.stroke();

    if (shading === 'solid') {
        ctx.fill();
        ctx.stroke();
    } else if (shading === 'striped') {
        ctx.save();
        ctx.clip();
        ctx.beginPath();
        const step = 6;
        ctx.lineWidth = 2;
        for (let i = -size; i < size; i += step) {
            ctx.moveTo(x + i, y);
            ctx.lineTo(x + i + size, y + size);
        }
        ctx.stroke();
        ctx.restore(); // Restore the previous state
    }
}

function drawSquare(x, y, color, shading, size) {
    ctx.fillStyle = color;
    ctx.strokeStyle = shading == 'solid' ? darkenColor(color) : color;
    ctx.strokeRect(x, y, size, size);

    if (shading === 'solid') {
        ctx.fillRect(x, y, size, size);
        ctx.strokeRect(x, y, size, size);
    } else if (shading === 'striped') {
        ctx.save(); // Save the current state
        ctx.beginPath();
        ctx.rect(x, y, size, size); // Define the clipping region
        ctx.clip(); // Clip to the current path (the square)
        ctx.beginPath();
        const step = 6; // Distance between stripes
        ctx.lineWidth = 2;
        for (let i = -size; i < size; i += step) {
            ctx.moveTo(x + i, y);
            ctx.lineTo(x + i + size, y + size);
        }
        ctx.stroke();
        ctx.restore(); // Restore the previous state
    }
}

function drawDiamond(x, y, color, shading, size) {
    ctx.beginPath();
    ctx.moveTo(x + size / 2, y); // Top point
    ctx.lineTo(x, y + size / 2); // Left point
    ctx.lineTo(x + size / 2, y + size); // Bottom point
    ctx.lineTo(x + size, y + size / 2); // Right point
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.strokeStyle = shading == 'solid' ? darkenColor(color) : color;
    ctx.stroke();

    if (shading === 'solid') {
        ctx.fill();
        ctx.stroke();
    } else if (shading === 'striped') {
        ctx.save(); // Save the current state
        ctx.clip(); // Clip to the diamond shape
        ctx.beginPath();
        const step = 6; // Distance between stripes
        ctx.lineWidth = 2;
        for (let i = -size; i < size * 2; i += step) {
            ctx.moveTo(x + i, y);
            ctx.lineTo(x + i + size, y + size);
        }
        ctx.stroke();
        ctx.restore(); // Restore the previous state
    }
}

function drawCardBorder(x, y, isSelected, fillCardWithSet=false) {
    const radius = 10; // Radius for rounded corners

    // Draw rounded rectangle
    ctx.fillStyle = isSelected ? 'gray' : 'white';
    ctx.fillStyle = fillCardWithSet ? 'blue' : ctx.fillStyle;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + cardWidth - radius, y);
    ctx.quadraticCurveTo(x + cardWidth, y, x + cardWidth, y + radius);
    ctx.lineTo(x + cardWidth, y + cardHeight - radius);
    ctx.quadraticCurveTo(x + cardWidth, y + cardHeight, x + cardWidth - radius, y + cardHeight);
    ctx.lineTo(x + radius, y + cardHeight);
    ctx.quadraticCurveTo(x, y + cardHeight, x, y + cardHeight - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();

    // Draw card border
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
}

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

// Start the animation loop
requestAnimationFrame(draw);