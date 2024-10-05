import { SudokuGame } from './sudokuGame';
import { SudokuGenerator } from './sudokuGenerator';

// Function to initialize the game
function initGame() {
    const generator = new SudokuGenerator();
    const game = new SudokuGame(generator.generate());
    
    // Add your game logic here
    console.log("Sudoku game initialized");
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);