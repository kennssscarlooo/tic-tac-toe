// Variable initializations
const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");
const easy = document.getElementById("easy");
const medium = document.getElementById("medium");
const hard = document.getElementById("hard");
const boxes = document.querySelectorAll(".box");
const char = document.getElementById("char");
const message = document.getElementById("message");
const restart = document.getElementById("restart");
var player1Score = 1;
var player2Score = 1;
var gameBoard;
var P1 = "X";
var P2 = "O";
const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
// Passing a class (.active) to the element that got clicked
var character = document.querySelector(".character").querySelectorAll("button");
character.forEach((button) => {
  button.addEventListener("click", function () {
    character.forEach((button) => button.classList.remove("active"));
    this.classList.add("active");
  });
});
var gamemode = document.querySelector(".gamemode").querySelectorAll("a");
gamemode.forEach((a) => {
  a.addEventListener("click", function () {
    gamemode.forEach((a) => a.classList.remove("active"));
    this.classList.add("active");
  });
});
// Function to show the mode that was selected by the user (Easy is the default game mode)
$(".dropdown-menu li a").click(function () {
  $(this).parents(".gamemode").find(".mode").text($(this).text());
  $(this).parents(".gamemode").find(".mode").val($(this).text());
});
// Giving event listener to the restart button to restart the game on click
restart.addEventListener("click", function () {
  startGame();
});
// Function to choose a character
$(".character > .btn").click(function () {
  if ($(this).attr("id") === "px") {
    P1 = "X";
    P2 = "O";
    startGame();
  } else {
    P1 = "O";
    P2 = "X";
    startGame();
  }
});
// Function to start the game and clear the game board
function startGame() {
  gameBoard = Array.from(Array(9).keys());
  for (var i = 0; i < boxes.length; i++) {
    message.innerHTML = "The game has started";
    char.style.visibility = "hidden";
    restart.style.display = "block";
    boxes[i].innerText = "";
    boxes[i].style.color = "black";
    boxes[i].addEventListener("click", clickedBox, false);
  }
}
// Function to put 'X' & 'O' in the game board
function clickedBox(box) {
  message.innerHTML = "AI's turn";
  if (typeof gameBoard[box.target.id] == "number") {
    turn(box.target.id, P1);
    // Logic to control the phase of the AI's turn and prevent it to put another mark on the board when the player has already won.
    if (!checkTie() && char.style.visibility !== "visible")
      setTimeout(() => turn(nextTurn(), P2), 300);
  }
}
function turn(boxId, player) {
  gameBoard[boxId] = player;
  document.getElementById(boxId).innerText = player;
  var gameResult = checkWinningCombos(gameBoard, player);
  if (gameResult) gameOver(gameResult);
}
// The turn that will be executed by the computer based on the selected game mode
function nextTurn() {
  message.innerHTML = "Your turn";
  if (easy.classList.contains("active")) {
    return emptyBoxes()[0];
  } else if (medium.classList.contains("active")) {
    return emptyBoxes()[randomMove()];
  } else if (hard.classList.contains("active")) {
    return minimax(gameBoard, P2).index;
  }
}
// Function to choose a random number that corresponds to the id's of box/es that are empty.
function randomMove() {
  var vacantBoxes = [];
  var random;
  boxes.forEach(function (box) {
    if (box.textContent == "") {
      vacantBoxes.push(box);
    }
  });
  random = Math.floor(Math.random() * vacantBoxes.length);
  return random;
}
// Function to check for a win.
function checkWinningCombos(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameResult = null;
  for (let [index, win] of winningCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameResult = { index: index, player: player };
      break;
    }
  }
  return gameResult;
}
// Function that shows the game result and update the score if there is a winner
function gameOver(gameResult) {
  for (let index of winningCombos[gameResult.index]) {
    document.getElementById(index).style.color =
      gameResult.player === P1 ? "orange" : "red";
  }
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].removeEventListener("click", clickedBox, false);
  }
  winner(
    gameResult.player === P1
      ? "You win, great job!"
      : "Sorry you lose, the AI wins."
  );
  gameResult.player === P1
    ? (player1.innerHTML = player1Score++)
    : (player2.innerHTML = player2Score++);
}
function winner(whoWon) {
  message.style.visibility = "visible";
  char.style.visibility = "visible";
  message.innerHTML = whoWon;
}
// Function to decide if the game is tie
function checkTie() {
  if (emptyBoxes().length === 0 && winner("")) {
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].style.color = "gray";
      boxes[i].removeEventListener("click", clickedBox, false);
    }
    message.style.visibility = "visible";
    winner("It's a tie.");
    return true;
  }
  return false;
}
// Function to find the available boxes
function emptyBoxes() {
  return gameBoard.filter((elem, i) => i === elem);
}
// The minimax function is the one that makes the computer unbeatable.
function minimax(newBoard, player) {
  var availBoxes = emptyBoxes();
  if (checkWinningCombos(newBoard, P1)) {
    return { score: -10 };
  } else if (checkWinningCombos(newBoard, P2)) {
    return { score: 10 };
  } else if (availBoxes.length === 0) {
    return { score: 0 };
  }

  var moves = [];
  for (let i = 0; i < availBoxes.length; i++) {
    var move = {};
    move.index = newBoard[availBoxes[i]];
    newBoard[availBoxes[i]] = player;

    if (player === P2) move.score = minimax(newBoard, P1).score;
    else move.score = minimax(newBoard, P2).score;
    newBoard[availBoxes[i]] = move.index;
    if (
      (player === P2 && move.score === 10) ||
      (player === P1 && move.score === -10)
    )
      return move;
    else moves.push(move);
  }

  let bestMove, bestScore;
  if (player === P2) {
    bestScore = -1000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    bestScore = 1000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}
