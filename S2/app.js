class Game {
    constructor(rows, cols, cellSize) {
        this.rows = rows;
        this.cols = cols;
        this.cellSize = cellSize;
        this.grid = this.createEmptyGrid();
        this.isRunning = false;
    }

    createEmptyGrid() {
        return Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    }

    randomize() {
        this.grid = this.grid.map(row => 
            row.map(() => Math.random() > 0.85)
        );
    }

    drawGliderGun() {
        // Write your function here
        const metrix = [
            [26, 1],
            [24, 2], [26, 2],
            [14, 3], [15, 3], [22, 3], [23, 3], [36, 3], [37, 3],
            [13, 4], [17, 4], [22, 4], [23, 4], [36, 4], [37, 4],
            [2, 5], [3, 5], [12, 5], [18, 5], [22, 5], [23, 5],
            [2, 6], [3, 6], [12, 6], [16, 6], [18, 6], [19, 6], [24, 6], [26, 6],
            [12, 7], [18, 7], [26, 7],
            [13, 8], [17, 8],
            [14, 9], [15, 9]
        ]

        metrix.forEach(([x, y]) => {
            this.grid[y][x] = true;
        });
    }

    drawPulsar() {
        const pattern = [
            [2,4],[3,4],[4,4],[8,4],[9,4],[10,4],
            [0,6],[5,6],[7,6],[12,6],
            [0,7],[5,7],[7,7],[12,7],
            [0,8],[5,8],[7,8],[12,8],
            [2,9],[3,9],[4,9],[8,9],[9,9],[10,9],
            [2,11],[3,11],[4,11],[8,11],[9,11],[10,11],
            [0,13],[5,13],[7,13],[12,13],
            [0,14],[5,14],[7,14],[12,14],
            [0,15],[5,15],[7,15],[12,15],
            [2,16],[3,16],[4,16],[8,16],[9,16],[10,16]
        ];
        pattern.forEach(([x, y]) => {
            this.grid[y][x] = true;
        });
    }

    drawPentaDecathlon() {
        const pattern = [
            [10,10],[11,10],[12,10],
            [9,11],[13,11],
            [9,12],[13,12],
            [10,13],[11,13],[12,13],
            [10,15],[11,15],[12,15],
            [9,16],[13,16],
            [9,17],[13,17],
            [10,18],[11,18],[12,18]
        ];
        pattern.forEach(([x, y]) => {
            this.grid[y][x] = true;
        });
    }


    countNeighbors(x, y) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                const nx = (x + dx + this.cols) % this.cols;
                const ny = (y + dy + this.rows) % this.rows;
                if (this.grid[ny][nx]) count++;
            }
        }
        return count;
    }

    update() {
        const newGrid = this.createEmptyGrid();
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const neighbors = this.countNeighbors(x, y);
                const isAlive = this.grid[y][x];
                newGrid[y][x] = (isAlive && (neighbors === 2 || neighbors === 3)) ||
                              (!isAlive && neighbors === 3);
            }
        }
        this.grid = newGrid;
    }
}

class Renderer {
    constructor(canvas, game) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.game = game;
        canvas.width = game.cols * game.cellSize;
        canvas.height = game.rows * game.cellSize;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let y = 0; y < this.game.rows; y++) {
            for (let x = 0; x < this.game.cols; x++) {
                if (this.game.grid[y][x]) {
                    this.ctx.fillStyle = '#2c3e50';
                    this.ctx.fillRect(
                        x * this.game.cellSize,
                        y * this.game.cellSize,
                        this.game.cellSize - 1,
                        this.game.cellSize - 1
                    );
                }
            }
        }
    }
}

// Initialize Game
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game(180, 360, 5);
    const canvas = document.getElementById('gridCanvas');
    const renderer = new Renderer(canvas, game);
    let intervalId = null;

    // Button Event Handlers
    document.getElementById('startBtn').addEventListener('click', () => {
        game.isRunning = !game.isRunning;
        document.getElementById('startBtn').textContent = 
            game.isRunning ? 'Stop' : 'Start';
        if (game.isRunning) {
            intervalId = setInterval(() => {
                game.update();
                renderer.draw();
            }, 1);
        } else {
            clearInterval(intervalId);
        }
    });

    document.getElementById('clearBtn').addEventListener('click', () => {
        game.grid = game.createEmptyGrid();
        renderer.draw();
    });

    document.getElementById('randomBtn').addEventListener('click', () => {
        game.randomize();
        renderer.draw();
    });

    document.getElementById('gliderGunBtn').addEventListener('click', () => {
        game.drawGliderGun();
        renderer.draw();
    });

    document.getElementById('pulsarBtn').addEventListener('click', () => {
        game.drawPulsar();
        renderer.draw();
    });

    document.getElementById('pentaDecathlonBtn').addEventListener('click', () => {
        game.drawPentaDecathlon();
        renderer.draw();
    });


    // Initial Draw
    renderer.draw();
});