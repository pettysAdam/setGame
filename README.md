# Set Card Game

## Overview
This is a digital implementation of the popular card game **Set**, built with JavaScript and HTML5 Canvas. The game challenges players to identify "sets" of three cards that meet specific matching or differing criteria.

## How It Works
- Each card has four attributes:
  - **Shape**: Circle, Square, or Diamond.
  - **Color**: Red, Purple, or Green.
  - **Shading**: Solid, Striped, or Outline.
  - **Number**: 1, 2, or 3 shapes per card.
- A **Set** is a group of three cards where each attribute (shape, color, shading, number) is **either all the same or all different** across the three cards.

## How to Play
1. **Objective**: Find sets of three cards from a displayed grid of 12-18 cards.
2. **Controls**:
   - Use the following keys to select cards:
     - `1`, `2`, `3`, `q`, `w`, `e`, `a`, `s`, `d`, `z`, `x`, `c` map to the cards in the grid.
   - Press the key corresponding to a card to select or deselect it.
   - Once three cards are selected, the game automatically checks if they form a valid set.
3. **Game Actions**:
   - If a valid set is found:
     - The selected cards are replaced by new cards from the deck.
     - A green message, "Valid Set!", is displayed.
   - If the selection is invalid:
     - A red message, "That's not a set!", is displayed, and the selection resets.

## Features
- **Randomized Deck**: A full deck of 81 unique cards is shuffled at the start of the game.
- **Dynamic Grid**: The game displays up to 18 cards (12 initially) in a 4x3 or 6x3 grid.
- - **NOTE** this is buggin, so only 12 can be shown at the moment
- **Visual Feedback**: Selected cards are highlighted, and success or failure messages are displayed.

## Development Notes
- The game logic uses the `CanvasRenderingContext2D` API for rendering cards and handling animations.
- All cards are generated programmatically, ensuring every game is unique.
- A helper function identifies valid sets among the displayed cards for debugging and gameplay.

## Future Enhancements
- Add multiplayer support.
- Implement hints for players who are stuck.
- Add scoring and a timer.

## Getting Started
1. Clone or download the repository.
2. Open the `index.html` file in a web browser to start playing.
3. Make sure your browser supports JavaScript and the HTML5 Canvas API.
