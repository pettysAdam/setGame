import Card from './Card.js';

export default class Deck {
    constructor() {
        const shapes = ['circle', 'square', 'diamond'];
        const colors = ['#FF6666', '#CC99FF', '#00FF7F'];
        const shadings = ['solid', 'stripes', 'stroke'];

        this.cards = [];
        for (let shape of shapes) {
            for (let color of colors) {
                for (let shading of shadings) {
                    for (let number = 1; number <= 3; number++) {
                        this.cards.push(new Card(shape, color, shading, number));
                    }
                }
            }
        }
        this.shuffle();
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    drawCards(count) {
        return this.cards.splice(0, count);
    }
}
