export default class Renderer {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.cardWidth = 150;
        this.cardHeight = 100;
    }

    drawBoard = (board) => {
        const cardGap = 10;

        const totalWidth = 3 * this.cardWidth + 2 * cardGap;
        const totalHeight = 4 * this.cardHeight + 3 * cardGap;
        const startX = (this.canvas.width - totalWidth) / 2;
        const startY = 5;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        board.displayedCards.forEach((card, i) => {
            const x = startX + (i % 3) * (this.cardWidth + cardGap);
            const y = startY + Math.floor(i / 3) * (this.cardHeight + cardGap);
            this.drawCard(x, y, card, board.selectedIndexes[i] === 1);
        });
    }

    drawCard = (x, y, card, isSelected, fillCardWithSet = false) => {
        this.drawCardBorder(x, y, isSelected, fillCardWithSet);

        const shape = card.shape;
        const color = card.color;
        const shading = card.shading;
        const number = card.number;
        const size = 36; // Adjust this value to change the size of the shapes

        const shapeFunc = {
            circle: this.drawCircle,
            square: this.drawSquare,
            diamond: this.drawDiamond
        }[shape];

        const totalWidth = number * size + (number - 1) * 10;
        const startX = x + (this.cardWidth - totalWidth) / 2;
        const startY = y + (this.cardHeight - size) / 2;

        this.ctx.lineWidth = 3;
        for (let i = 0; i < number; i++) {
            shapeFunc(startX + i * (size + 10), startY, color, shading, size, this.ctx);
        }
        this.ctx.lineWidth = 1;
    }

    drawCardBorder = (x, y, isSelected, fillCardWithSet = false) => {
        const radius = 10; // Radius for rounded corners

        // Draw rounded rectangle
        this.ctx.fillStyle = isSelected ? 'gray' : 'white';
        this.ctx.fillStyle = fillCardWithSet ? 'blue' : this.ctx.fillStyle;
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + this.cardWidth - radius, y);
        this.ctx.quadraticCurveTo(x + this.cardWidth, y, x + this.cardWidth, y + radius);
        this.ctx.lineTo(x + this.cardWidth, y + this.cardHeight - radius);
        this.ctx.quadraticCurveTo(x + this.cardWidth, y + this.cardHeight, x + this.cardWidth - radius, y + this.cardHeight);
        this.ctx.lineTo(x + radius, y + this.cardHeight);
        this.ctx.quadraticCurveTo(x, y + this.cardHeight, x, y + this.cardHeight - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
        this.ctx.fill();

        // Draw card border
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    darkenColor = (color) => {
        const factor = 0.5; // Lower is darker
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        const newR = Math.max(0, Math.min(255, Math.floor(r * factor)));
        const newG = Math.max(0, Math.min(255, Math.floor(g * factor)));
        const newB = Math.max(0, Math.min(255, Math.floor(b * factor)));
        return `rgb(${newR}, ${newG}, ${newB})`;
    }

    drawCircle = (x, y, color, shading, size, ctx) => {
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.strokeStyle = shading == 'solid' ? this.darkenColor(color) : color;
        ctx.stroke();

        if (shading === 'solid') {
            ctx.fill();
            ctx.stroke();
        } else if (shading === 'stripes') {
            ctx.save();
            this.drawStripes(x, y, size, ctx);
        }
    }

    drawSquare = (x, y, color, shading, size, ctx) => {
        ctx.fillStyle = color;
        ctx.strokeStyle = shading == 'solid' ? this.darkenColor(color) : color;
        ctx.strokeRect(x, y, size, size);

        if (shading === 'solid') {
            ctx.fillRect(x, y, size, size);
            ctx.strokeRect(x, y, size, size);
        } else if (shading === 'stripes') {
            ctx.save(); // Save the current state
            ctx.beginPath();
            ctx.rect(x, y, size, size); // Define the clipping region
            this.drawStripes(x, y, size, ctx);
        }
    }

    drawDiamond = (x, y, color, shading, size, ctx) => {
        ctx.beginPath();
        ctx.moveTo(x + size / 2, y); // Top point
        ctx.lineTo(x, y + size / 2); // Left point
        ctx.lineTo(x + size / 2, y + size); // Bottom point
        ctx.lineTo(x + size, y + size / 2); // Right point
        ctx.closePath();

        ctx.fillStyle = color;
        ctx.strokeStyle = shading == 'solid' ? this.darkenColor(color) : color;
        ctx.stroke();

        if (shading === 'solid') {
            ctx.fill();
            ctx.stroke();
        } else if (shading === 'stripes') {
            ctx.save(); // Save the current state
            this.drawStripes(x, y, size, ctx);
        }
    }

    drawStripes = (x, y, size, ctx) => {
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