import { SudokuGenerator } from './sudokuGenerator.js';

export class SudokuGame {
    private board: number[][] = [];
    private solution: number[][] = [];
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private cellSize: number = 50;
    private selectedCell: { row: number, col: number } | null = null;
    private initialBoard: number[][] = [];
    private title: HTMLHeadingElement;

    constructor() {
        this.title = document.createElement('h1');
        this.title.textContent = 'Sudoku AI';
        document.body.prepend(this.title);
        this.canvas = document.createElement('canvas');
        this.canvas.width = 450;
        this.canvas.height = 450;
        document.body.appendChild(this.canvas);

        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('Unable to get 2D context');
        }
        this.ctx = context;

        this.createButtons();
        this.addEventListeners();
        this.newGame();
    }

    private createButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.marginTop = '20px';

        const newGameButton = this.createStyledButton('New Game', () => this.newGame());
        const solveGameButton = this.createStyledButton('Solve Game', () => this.solveGame());

        buttonContainer.appendChild(newGameButton);
        buttonContainer.appendChild(solveGameButton);

        document.body.appendChild(buttonContainer);
    }

    private createStyledButton(text: string, onClick: () => void): HTMLButtonElement {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', onClick);
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.cursor = 'pointer';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.transition = 'background-color 0.3s';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#45a049';
        });

        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#4CAF50';
        });

        return button;
    }

    private addEventListeners() {
        this.canvas.addEventListener('click', this.handleClick.bind(this));
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }

    private newGame() {
        const generator = new SudokuGenerator();
        this.solution = generator.generate();
        this.board = this.solution.map(row => row.map(cell => Math.random() < 0.5 ? cell : 0));
        this.initialBoard = this.board.map(row => [...row]);
        this.render();
    }

    private render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawHighlight();  // Add this line
        this.drawNumbers();
    }

    private drawHighlight() {
        if (this.selectedCell) {
            const { row, col } = this.selectedCell;
            this.ctx.fillStyle = 'rgba(173, 216, 230, 0.5)';  // Light blue with 50% opacity
            this.ctx.fillRect(
                col * this.cellSize,
                row * this.cellSize,
                this.cellSize,
                this.cellSize
            );
        }
    }

    private drawGrid() {
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

    private drawNumbers() {
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const value = this.board[row][col];
                if (value !== 0) {
                    const x = (col + 0.5) * this.cellSize;
                    const y = (row + 0.5) * this.cellSize;
                    if (this.initialBoard[row][col] === value) {
                        this.ctx.fillStyle = 'black';
                    } else if (this.solution[row][col] === value) {
                        this.ctx.fillStyle = 'green';
                    } else {
                        this.ctx.fillStyle = 'red';
                    }
                    this.ctx.fillText(value.toString(), x, y);
                }
            }
        }
    }

    private handleClick(e: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);

        if (row >= 0 && row < 9 && col >= 0 && col < 9) {
            if (this.selectedCell && this.selectedCell.row === row && this.selectedCell.col === col) {
                // Deselect if clicking the same cell
                this.selectedCell = null;
            } else {
                this.selectedCell = { row, col };
            }
            this.render();
        }
    }

    private handleKeyPress(e: KeyboardEvent) {
        if (this.selectedCell) {
            const { row, col } = this.selectedCell;
            // Check if the cell was initially empty
            if (this.initialBoard[row][col] === 0) {
                if (e.key >= '1' && e.key <= '9') {
                    const value = parseInt(e.key);
                    this.board[row][col] = value;
                    this.render();
                } else if (e.key === 'Backspace' || e.key === 'Delete') {
                    this.board[row][col] = 0;
                    this.render();
                }
            }
        }
    }

    private centerContent() {
        const windowHeight = window.innerHeight;
        const contentHeight = this.title.offsetHeight + this.canvas.height + 100; // 100px for button and margins
        const topMargin = Math.max(0, (windowHeight - contentHeight) / 2);
        this.title.style.marginTop = `${topMargin}px`;
    }

    private solveGame(): void {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.board[row][col] === 0) {
                    this.board[row][col] = this.solution[row][col];
                }
            }
        }
        this.render();
    }
}