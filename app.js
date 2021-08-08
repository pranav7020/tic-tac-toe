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
        findEmptyCells(userCombo);
        checkWinner("X");

        if (emptyCells.length > 0) {
            setTimeout(pcMove, 300);
        }
    }
}

function pcMove() {
    let pcSelectedCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    pcCombo.push(pcSelectedCell);
    const parent = Playground.children[pcSelectedCell];

    createXOcell(parent, "O");
    userTurn = true;
    checkWinner("O");
}

function checkWinner(value) {
    if ([...userCombo, ...pcCombo].length >= 5) {
        let cells = Playground.children;

        if (emptyCells.length === 0 && !userTurn) {
            Title.innerText = "✨ Tie! ✨";
        }

        winCombo.some(elArr => {
            // if a === b && b === c then true
            if ((cells[elArr[0]].dataset.value === value) &&
                (cells[elArr[1]].dataset.value === value) &&
                (cells[elArr[2]].dataset.value === value)) {
                userTurn = false;
                emptyCells = [];
                let color = "#FD5A43";
                let result = "You Lost 🥺"
                if (value === "X") {
                    color = "#58D6BF";
                    result = "You Won 🎉"
                }
                elArr.forEach(el => {
                    cells[el].style.backgroundColor = color
                });
                Title.innerText = result;
                Button.innerText = "Play Again 🔥"
                return true;
            }
        })
    }
}

function findEmptyCells(array) {
    emptyCells = [];
    /* Easy */
    // winCombo
    //     .filter(el => el.includes(array[array.length - 1]))
    //     .forEach(el => emptyCells = [...emptyCells, ...el]);

    /* Hard */
    winCombo
        .filter(el => {
            let count = 0;

            userCombo.includes(el[0]) && count++;
            userCombo.includes(el[1]) && count++;
            userCombo.includes(el[2]) && count++;

            if (userCombo.length >= 2 && count === 2) return el;
            if (userCombo.length < 2 && count === 1) return el;
        })
        .forEach(el => emptyCells = [...emptyCells, ...el]);

    emptyCells = [... new Set(emptyCells)]
        .filter(el => ![...userCombo, ...pcCombo].includes(el));

    if (emptyCells.length === 0) {
        for (let i = 0; i < 9; i++) {
            if (![...userCombo, ...pcCombo].includes(i))
                emptyCells.push(i)
        }
        return
    }
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