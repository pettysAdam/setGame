export default class Card {
    constructor(shape, color, shading, number) {
        this.shape = shape;
        this.color = color;
        this.shading = shading;
        this.number = number;
    }

    static isSet(card1, card2, card3) {
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
