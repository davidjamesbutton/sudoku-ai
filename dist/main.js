import { SudokuGame } from './sudokuGame.js';
// Expose SudokuGame to the global scope (window object)
window.SudokuGame = SudokuGame;
// Initialize the game when the window loads
window.onload = () => {
    new SudokuGame();
};
