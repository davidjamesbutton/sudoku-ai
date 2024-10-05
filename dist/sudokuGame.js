import { SudokuGenerator, generateSudoku } from './sudokuGenerator.js';
export class SudokuGame {
    constructor() {
        this.board = [];
        this.solution = [];
        this.cellSize = 50;
        this.selectedCell = null;
        // Use generateSudoku here if needed
        const puzzle = generateSudoku();
        this.canvas = document.createElement('canvas');
        this.canvas.width = 450;
        this.canvas.height = 450;
        document.body.appendChild(this.canvas);
        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('Unable to get 2D context');
        }
        this.ctx = context;
        this.createNewGameButton();
        this.addEventListeners();
        this.newGame();
    }
    createNewGameButton() {
        const button = document.createElement('button');
        button.textContent = 'New Game';
        button.addEventListener('click', () => this.newGame());
        document.body.appendChild(button);
    }
    addEventListeners() {
        this.canvas.addEventListener('click', this.handleClick.bind(this));
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }
    newGame() {
        const generator = new SudokuGenerator();
        this.solution = generator.generate();
        this.board = this.solution.map(row => row.map(cell => Math.random() < 0.5 ? cell : 0));
        this.render();
    }
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawNumbers();
    }
    drawGrid() {
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= 9; i++) {
            const pos = i * this.cellSize;
            this.ctx.beginPath();
            this.ctx.moveTo(pos, 0);
            this.ctx.lineTo(pos, this.canvas.height);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(0, pos);
            this.ctx.lineTo(this.canvas.width, pos);
            this.ctx.stroke();
            if (i % 3 === 0) {
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.moveTo(pos, 0);
                this.ctx.lineTo(pos, this.canvas.height);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(0, pos);
                this.ctx.lineTo(this.canvas.width, pos);
                this.ctx.stroke();
                this.ctx.lineWidth = 1;
            }
        }
    }
    drawNumbers() {
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const value = this.board[row][col];
                if (value !== 0) {
                    const x = (col + 0.5) * this.cellSize;
                    const y = (row + 0.5) * this.cellSize;
                    this.ctx.fillStyle = this.solution[row][col] === value ? 'black' : 'blue';
                    this.ctx.fillText(value.toString(), x, y);
                }
            }
        }
    }
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);
        if (row >= 0 && row < 9 && col >= 0 && col < 9) {
            this.selectedCell = { row, col };
            this.render();
        }
    }
    handleKeyPress(e) {
        if (this.selectedCell) {
            const { row, col } = this.selectedCell;
            if (e.key >= '1' && e.key <= '9') {
                const value = parseInt(e.key);
                if (this.solution[row][col] === value) {
                    this.board[row][col] = value;
                    this.render();
                }
            }
            else if (e.key === 'Backspace' || e.key === 'Delete') {
                this.board[row][col] = 0;
                this.render();
            }
        }
    }
}
