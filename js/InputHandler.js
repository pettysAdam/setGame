export default class InputHandler {
    constructor(board, drawCards, displayMessage, findSets, drawNext3Cards) {
        this.board = board;
        this.drawCards = drawCards;
        this.displayMessage = displayMessage;
        this.findSets = findSets;
        this.drawNext3Cards = drawNext3Cards;

        this.indexesSelected = Array(18).fill(0);
        this.keyToIndexMap = {
            '1': 0, '2': 1, '3': 2, 'q': 3, 'w': 4,
            'e': 5, 'a': 6, 's': 7, 'd': 8, 'z': 9,
            'x': 10, 'c': 11, '4': 12, '5': 13, '6': 14,
            'r': 15, 't': 16, 'y': 17, 'f': 18, 'g': 19, 'h': 20
        };

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleKeyDown(event) {
        if (this.keyToIndexMap.hasOwnProperty(event.key)) {
            const index = this.keyToIndexMap[event.key];
            if (index >= this.board.displayedCards.length) {
                return;
            }
            this.indexesSelected[index] = this.indexesSelected[index] === 0 ? 1 : 0;
            if (this.indexesSelected.filter(x => x === 1).length === 3) {
                const selectedCards = this.indexesSelected.map(
                    (x, i) => x === 1 ? this.board.displayedCards[i] : null
                ).filter(x => x !== null);

                if (this.findSets(selectedCards).length > 0) {
                    this.drawNext3Cards(true);
                    this.displayMessage("Valid Set!", "green");
                } else {
                    this.displayMessage("That's not a set!", "red");
                }
                this.indexesSelected.fill(0);
            }
            this.drawCards();
        }
        if (event.key === 'p' && this.board.displayedCards.length < 18) {
            //this.drawNext3Cards(false);
        }
    }
}