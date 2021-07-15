"use strict";

const playfieldEl = document.getElementById("playfield");
const widthEl = document.getElementById("width");
const heightEl = document.getElementById("height");
const bombDensityEl = document.getElementById("bomb_density");
const newGameBtnEl = document.getElementById("newGame");

const WIDTH = 20;
const HEIGHT = 20;
const BOMB_DENSITY = 0.15;
const EMPTY = "";
const FLAG = "🚩";
const BOMB = "💣";
const TEXT_COLORS = [
    "0",
    "GREEN",
    "BLUE",
    "RED",
    "PURPLE",
    "MAGENTA",
    "BLACK",
    "BLACK",
    "BLACK",
];

class Playfield {

    constructor(playfieldEl, width = WIDTH, height = HEIGHT, bombDensity = BOMB_DENSITY) {
        this.el = playfieldEl;
        this.reset(width, height, bombDensity);
    }

    createField() {

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const btn = document.createElement("button");
                btn.id = `btn_${x}_${y}`;
                btn.classList.add("btn");
                btn.dataset.x = x;
                btn.dataset.y = y;
                btn.addEventListener("click", this.btnClick.bind(this), false);
                btn.addEventListener("contextmenu", this.btnRightClick.bind(this), false);
                this.el.appendChild(btn);
            }
        }
    }

    reset(newWidth = WIDTH, newHeight = HEIGHT, newBombDensity = BOMB_DENSITY) {
        this.width = newWidth;
        this.height = newHeight;
        this.bombDensity = newBombDensity;
        this.el.innerHTML = "";
        this.el.style.gridTemplateColumns = `repeat(${this.width}, 1fr)`;
        this.el.style.gridTemplateRows = `repeat(${this.height}, 1fr)`;
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const btn = document.createElement("button");
                btn.id = `btn_${x}_${y}`;
                btn.classList.add("btn");
                btn.dataset.x = x;
                btn.dataset.y = y;
                btn.dataset.flagged = false;
                btn.dataset.isBomb = Math.random() < this.bombDensity;
                btn.dataset.bombCount = 0;
                btn.dataset.marked = false;
                btn.textContent = EMPTY;
                btn.disabled = false;
                btn.addEventListener("click", this.btnClick.bind(this), false);
                btn.addEventListener("contextmenu", this.btnRightClick.bind(this), false);
                this.el.appendChild(btn);
            }
        }
    }

    countBombs(btn) {
        const x = parseInt(btn.dataset.x);
        const y = parseInt(btn.dataset.y);
        let count = 0;
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (!(i === x && j === y) && i >= 0 && i < this.width && j >= 0 && j < this.height) {
                    const btn = document.getElementById(`btn_${i}_${j}`);
                    if (btn.dataset.isBomb === "true") {
                        count++;
                    }
                }
            }
        }
        return count;
    }

    reveal() {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const btnId = `btn_${x}_${y}`;
                this.btnClick({ target: document.getElementById(btnId) }, true);
            }
        }
    }

    markEmptyNeighbors(btn) {
        const x = parseInt(btn.dataset.x);
        const y = parseInt(btn.dataset.y);

        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (!(i === x && j === y) && i >= 0 && i < this.width && j >= 0 && j < this.height) {
                    const neighbor = document.getElementById(`btn_${i}_${j}`);
                    if (neighbor.dataset.marked !== "true") {
                        const bombCount = this.countBombs(neighbor);
                        if (bombCount === 0) {
                            this.btnClick({ target: neighbor });
                        }
                    }
                }
            }
        }
    }
    btnClick(evt, revealing = false) {
        const btn = evt.target;
        btn.disabled = true;
        if (btn.dataset.isBomb === "true") {
            btn.textContent = BOMB;
            if (!revealing) {
                this.reveal();
            }
            // GAME OVER MAN
            return;
        }
        if (btn.dataset.marked === "false") {
            btn.dataset.marked = true;
            const bombCount = this.countBombs(btn);
            btn.dataset.bombCount = bombCount;
            if (bombCount > 0) {
                btn.textContent = bombCount;
                btn.style.color = TEXT_COLORS[bombCount];
            } else {
                this.markEmptyNeighbors(btn);
            }
        }
    }

    btnRightClick(evt) {
        evt.preventDefault();
        const btn = evt.target;
        if (btn.dataset.bombCount !== "0") {
            return;
        }
        if (btn.dataset.flagged === "false") {
            btn.dataset.flagged = true;
            btn.textContent = FLAG;
        } else {
            btn.dataset.flagged = false;
            btn.textContent = EMPTY;
        }
    }
}

const playfield = new Playfield(playfieldEl, widthEl.value, heightEl.value, bombDensityEl.value);

newGameBtnEl.addEventListener("click", e => playfield.reset(widthEl.value, heightEl.value, bombDensityEl.value), false);