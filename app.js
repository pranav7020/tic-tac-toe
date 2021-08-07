const winCombo = [
    [0, 1, 2], /* --- */
    [3, 4, 5], /* --- */
    [6, 7, 8], /* --- */
    [0, 3, 6], /* |   */
    [1, 4, 7], /*  |  */
    [2, 5, 8], /*   | */
    [0, 4, 8], /*  \  */
    [2, 4, 6]  /*  /  */
]

let userCombo = [];
let pcCombo = [];
let emptyCells = [];
let userTurn = true;

const Playground = document.getElementById("playground");
const Button = document.getElementById("reset-btn");
const Title = document.getElementById("title");

function userMove(e) {
    if (userTurn) {
        userTurn = false;
        const parent = e.target;
        const userSelectedCell = parseInt(parent.dataset.cell);
        userCombo.push(userSelectedCell);

        createXOcell(parent, "X");

        findEmptyCells(userSelectedCell);

        // console.log("user : ", userCombo);
        // console.log("pc : ", pcCombo);
        // console.log("empty : ", emptyCells);
        if (userCombo.length >= 3) checkWinner("X");

        if (emptyCells.length > 0) {
            setTimeout(pcMove, 300);
        }
    }
}

function pcMove() {
    let pcSelectedCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    pcCombo.push(pcSelectedCell);
    const parent = Playground.children[pcSelectedCell];

    findEmptyCells(pcSelectedCell);

    createXOcell(parent, "O");
    userTurn = true;
    if (pcCombo.length >= 3) checkWinner("O");
}

function checkWinner(value) {
    let cells = Playground.children;
    let winnerComboCells;

    winCombo.some(elArr => {
        let count = 0;

        elArr.some(el => {
            if (!cells[el].dataset.value || cells[el].dataset.value !== value) return true
            count++;
        })

        if (count >= 3) {
            winnerComboCells = elArr;
            return true;
        }
    })

    if (emptyCells.length === 0 && !userTurn) {
        Title.innerText = "Tie!";
    }

    if (winnerComboCells) {
        userTurn = false;
        emptyCells = [];
        let color = "red";
        let result = "You Lost 🥺"
        if (value === "X") {
            color = "green";
            result = "You Won 🎉"
        }
        console.log("winner combo : ", winnerComboCells);
        winnerComboCells.forEach(el => {
            cells[el].style.backgroundColor = color
        });
        Title.innerText = result;
        Button.innerText = "Play Again 🔥"
    }

}

function findEmptyCells(cell) {
    winCombo
        .filter(el => el.includes(cell))
        .forEach(el => emptyCells = [...emptyCells, ...el]);

    emptyCells = [... new Set(emptyCells)]
        .filter(el => ![...userCombo, ...pcCombo].includes(el) && el);
}

function createPlayground() {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.setAttribute("data-cell", i);
        cell.addEventListener('click', userMove);

        Playground.appendChild(cell);
    }
}

function clearPlayground() {
    let cells = Playground.childNodes;
    for (let i = cells.length - 1; i >= 0; i--) {
        cells[i].remove();
    }
}

function createXOcell(parent, value) {
    const pEl = document.createElement("p");
    pEl.innerText = value;

    parent.appendChild(pEl);
    parent.setAttribute("data-value", value);
    parent.style.pointerEvents = "none";
}

function reset() {
    console.log('reset');
    userCombo = [];
    pcCombo = [];
    emptyCells = [];
    userTurn = true;
    Title.innerText = "Tic-Tac-Toe";
    Button.innerText = "Reset";
    clearPlayground();
    createPlayground();
}

document.addEventListener('DOMContentLoaded', () => {
    createPlayground()
})