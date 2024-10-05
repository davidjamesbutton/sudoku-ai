export class SudokuGenerator {
    private board: number[][];

    constructor() {
        this.board = Array(9).fill(null).map(() => Array(9).fill(0));
    }

    public generate(): number[][] {
        this.fillBoard(0, 0);
        return this.board;
    }

    private fillBoard(row: number, col: number): boolean {
        if (col === 9) {
            row++;
            col = 0;
        }

        if (row === 9) {
            return true;
        }

        if (this.board[row][col] !== 0) {
            return this.fillBoard(row, col + 1);
        }

        const numbers = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        for (const num of numbers) {
            if (this.isValid(row, col, num)) {
                this.board[row][col] = num;
                if (this.fillBoard(row, col + 1)) {
                    return true;
                }
                this.board[row][col] = 0;
            }
        }

        return false;
    }

    private isValid(row: number, col: number, num: number): boolean {
        // Check row
        for (let i = 0; i < 9; i++) {
            if (this.board[row][i] === num) {
                return false;
            }
        }

        // Check column
        for (let i = 0; i < 9; i++) {
            if (this.board[i][col] === num) {
                return false;
            }
        }

        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[boxRow + i][boxCol + j] === num) {
                    return false;
                }
            }
        }

        return true;
    }

    private shuffle(array: number[]): number[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

// Make sure the generateSudoku function is exported
export function generateSudoku(): number[][] {
    const generator = new SudokuGenerator();
    return generator.generate();
}