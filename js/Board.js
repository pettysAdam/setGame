export default class Board {
    constructor(deck) {
        this.deck = deck;
        this.displayedCards = deck.drawCards(12);
        this.selectedIndexes = Array(12).fill(0);
    }

    selectCard(index) {
        this.selectedIndexes[index] = this.selectedIndexes[index] === 0 ? 1 : 0;
    }

    getSelectedCards() {
        return this.selectedIndexes
            .map((selected, i) => (selected ? this.displayedCards[i] : null))
            .filter(Boolean);
    }

    replaceSelectedCards() {
        const newCards = this.deck.drawCards(3);
        this.displayedCards = this.displayedCards.map((card, index) =>
            this.selectedIndexes[index] ? newCards.shift() || card : card
        );
        this.selectedIndexes.fill(0);
    }

    hasAvailableSet() {
        for (let i = 0; i < this.displayedCards.length - 2; i++) {
            for (let j = i + 1; j < this.displayedCards.length - 1; j++) {
                for (let k = j + 1; k < this.displayedCards.length; k++) {
                    if (this.isSet(this.displayedCards[i], this.displayedCards[j], this.displayedCards[k])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    isSet(card1, card2, card3) {
        const allSameOrAllDifferent = (prop) =>
            (card1[prop] === card2[prop] && card2[prop] === card3[prop]) ||
            (card1[prop] !== card2[prop] && card2[prop] !== card3[prop] && card1[prop] !== card3[prop]);
        return (
            allSameOrAllDifferent('shape') &&
            allSameOrAllDifferent('color') &&
            allSameOrAllDifferent('shading') &&
            allSameOrAllDifferent('number')
        );
    }
}
