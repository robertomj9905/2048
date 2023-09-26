/** Game Variables */
var board; 
const rows = 4;
const cols = 4;
var score;
var isKeyUpListenerOn = false; 
var isNewGame = false;

window.addEventListener("load", () => {
    setGame();
});

document.getElementById("new-game").addEventListener("click", () => {
    isNewGame = true;
    setGame();
    isNewGame = false;
});


/**This function sets up an initial game state with two random tiles 
 * that can either be 2 (90% chance) or 4 (10% chance).*/
function setGame() { 
    score = 0;
    board = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ]

    //Attach keyup event listener if it does not exist
    if (!isKeyUpListenerOn) {
        document.addEventListener("keyup", handleKeyUp);
        isKeyUpListenerOn = true;
        console.log("keyup event listener has been added.");
    }

    //Set the title of the game and score
    document.querySelector("h1").innerText = "2048";
    document.getElementById("score").innerText = `${score}`;
    
    //Populate the game board
    for(let r = 0; r<rows; r++) {
        for(let c = 0; c <cols; c++) {
            let tile = document.createElement("div");
            tile.id = `${r}-${c}`;
            let num = board[r][c];
            updateTile(tile, num);
            
            if (isNewGame) {
                document.getElementById(`${r}-${c}`).replaceWith(tile);
            } else {
                document.getElementById("board").append(tile);
            }

        }
    }
    addTwoOrFour();
    addTwoOrFour();
}

/**Updates a tile's innerText and class list. This results with the tile having a new number and 
 specific CSS styling applied to it according to that number.
 */
function updateTile(tile, num) {
    tile.innerText= "";
    tile.classList.value= ""; //Clears the class list
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num;
        tile.classList.add(`t${num}`);
    }
}

/** Callback function used to handle directional keys. When a directional key pops up after being pressed, 
 * the appropriate board tilt will occur and the results from combined tiles will be added to the player's score. 
 * The score update will be reflected on the webpage. Additionally, after every tilt a new tile containing either
 * a 2 or 4 will appear on the board if possible, and the gameOver() functions is executed to check if the game 
 * has come to an end.*/
function handleKeyUp(event) {
    switch(event.code) {
        case "ArrowLeft": 
            slideLeft();
            break;
        case "ArrowRight":
            slideRight();
            break;
        case "ArrowUp": 
            slideUp();
            break;
        case "ArrowDown": 
            slideDown(); 
            break;
    }
    
    let directionKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    if (directionKeys.includes(event.code)) {
        addTwoOrFour();
        document.getElementById("score").innerText = `${score}`;
        gameOver();
    }    
}

/** Tilts the board to the left and merging occurs is possible. */
function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let mergedRow = board[r];
        mergedRow = slide(mergedRow);
        board[r] = mergedRow;

        for (let c = 0; c < cols; c++) {
            let tile = document.getElementById(`${r}-${c}`);
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

/** Tilts the board to the right and merging occurs is possible. */
function slideRight() {
    for (let r = 0; r < rows; r++) {
        let mergedRow = board[r];
        mergedRow.reverse();
        mergedRow = slide(mergedRow);
        mergedRow.reverse();
        board[r] = mergedRow;

        for (let c = 0; c < cols; c++) {
            let tile = document.getElementById(`${r}-${c}`);
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

/** Tilts the board upwards and merging occurs is possible. */
function slideUp() {
    for (let c = 0; c < cols; c++) {
        let mergedRow = [board[0][c], board[1][c], board[2][c], board[3][c]];
        mergedRow = slide(mergedRow);

        for (let r = 0; r < rows; r++) {
            board[r][c] = mergedRow[r]
            let tile = document.getElementById(`${r}-${c}`);
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

/** Tilts the board donwards and merging occurs is possible. */
function slideDown() {
    for (let c = 0; c < cols; c++) {
        let mergedRow = [board[0][c], board[1][c], board[2][c], board[3][c]];
        mergedRow.reverse();
        mergedRow = slide(mergedRow);
        mergedRow.reverse();


        for (let r = 0; r < rows; r++) {
            board[r][c] = mergedRow[r]
            let tile = document.getElementById(`${r}-${c}`);
            let num = board[r][c];
            updateTile(tile, num);
        }
    }

}

/**Returns the result of merging a row in the left direction. 
 * The algorithm to accomplish this is: 
 * 1. Clear zeroes
 * 2. Merge 
 * 3. Clear zeroes
 * 4. Add zeroes to the back
*/
function slide(row) {
    let mergedRow = row.filter((el) => el > 0); 

    for (let i = 0; i < mergedRow.length-1; i++) {
        if (mergedRow[i] == mergedRow[i+1]) {
            mergedRow[i] *= 2;
            mergedRow[i+1] = 0;
            score += mergedRow[i];
        }
    }

    mergedRow = mergedRow.filter((el) => el > 0);

    while (mergedRow.length < cols) {
        mergedRow.push(0);
    }
    return mergedRow;
}

/** Randomly places a tile containing either a 2 or 4 on the board on a available cell. A tile with 
 * a 2 has a 90% chance of being placed and a tile with a 4 has a 10% chance being placed. */
function addTwoOrFour() {
    if (!emptyTile()) {
        return;
    }

    let tileAdded = false; 
    while (tileAdded != true) {
        let randomRow = Math.floor((Math.random()*rows));
        let randomCol = Math.floor((Math.random()*cols));
        if (board[randomRow][randomCol] == 0) {
            tileAdded = true; 
            let numToAdd = twoOrFourGenerator();
            board[randomRow][randomCol] = numToAdd;
            let tile = document.getElementById(`${randomRow}-${randomCol}`);
            tile.innerText = `${numToAdd}`;
            tile.classList.add(`t${numToAdd}`); 
        }
    }
}

/**Returns either a two or four with a 2 having a 90% chance of being returned 
 * and a 4 having a 10% chance.*/
function twoOrFourGenerator() {
    let probArr = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
    let randNum = Math.floor(Math.random()*probArr.length);
    return probArr[randNum];
}

/**Returns true if an empty tiles exists in the board. Otherwise, 
 *the function returns false. Empty tiles are tiles with a board[r][c]
 *equaling zero. */
function emptyTile() {
    for(let r = 0; r<rows; r++) {
        for(let c = 0; c <cols; c++) {
            if (board[r][c] === 0) {
                return true;
            }
        }
    }
    return false; 
}

/* The game is over when either the player wins or they lose. 
   The player wins if they have reached the 2048 tile. 
   The player loses if they can no longer make a valid move.
   This is the case when the board is filled and no more merging can occur.
   This function handles the end of the game depending on whether the player has won or lost. */
function gameOver() {
    let header = document.querySelector("h1");
    let hasWon = winner();
    let hasLost = loser();

    if (hasWon) {
        header.innerText = "Winner 😎🤘";
    } else if (hasLost) {
        header.innerText = "You have lost 😅"
    }

    if (hasWon || hasLost) {
        document.removeEventListener("keyup", handleKeyUp);
        isKeyUpListenerOn = false;
        console.log("event listener has been removed")
    }
}

/**Returns true if the player has won. Returns false if the player has not won. */
function winner() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] == 2048) {
                return true;
            }
        }
    }
    return false;
}

/**Returns true if the player has lost and false if they have not lost. */
function loser() {
    if (emptyTile()) {
        return false;
    } else {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                //Check to the right
                if (c != (cols-1) && board[r][c] == board[r][c+1]) {
                    return false;
                } 
                
                //Check below
                if (r != (rows-1) && board[r][c] == board[r+1][c]) {
                    return false;
                }
            }
        }
        return true;
    }
}

