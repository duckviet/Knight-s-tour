let BOARD_SIZE;
let XstartVal;
let YstartVal;

function SubmitFunc() {
  const nValue = parseInt(document.getElementById("inputN").value);
  const xValue = parseInt(document.getElementById("inputX").value);
  const yValue = parseInt(document.getElementById("inputY").value);

  BOARD_SIZE = nValue;
  XstartVal = xValue;
  YstartVal = yValue;

  const boardContainer = document.getElementById("board");
  boardContainer.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;
  boardContainer.style.gridTemplateRows = `repeat(${BOARD_SIZE}, 1fr)`;

  const finalBoard = knightTour(XstartVal, YstartVal);
  renderChessBoard(finalBoard, boardContainer);
}

function validMoves(row, col, board, N) {
  const moves = [];
  const rowMoves = [-2, -1, 1, 2, 2, 1, -1, -2];
  const colMoves = [1, 2, 2, 1, -1, -2, -2, -1];

  for (let i = 0; i < 8; i++) {
    const newRow = row + rowMoves[i];
    const newCol = col + colMoves[i];

    if (
      newRow >= 0 &&
      newRow < N &&
      newCol >= 0 &&
      newCol < N &&
      board[newRow][newCol] === 0
    ) {
      moves.push([newRow, newCol]);
    }
  }

  return moves;
}

function solve(row, col, moveNum, board, N, moveCount) {
  board[row][col] = moveNum;
  moveCount[0]++;

  if (moveNum === N * N) {
    return true;
  }

  const moves = validMoves(row, col, board, N);
  moves.sort(
    (a, b) =>
      validMoves(a[0], a[1], board, N).length -
      validMoves(b[0], b[1], board, N).length
  );

  for (const move of moves) {
    const [newRow, newCol] = move;

    if (solve(newRow, newCol, moveNum + 1, board, N, moveCount)) {
      return true;
    }
  }

  board[row][col] = 0;
  moveCount[0]--;

  return false;
}

function knightTour(startRow, startCol) {
  const board = Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(0)
  );
  const moveCount = [0];

  if (solve(startRow, startCol, 1, board, BOARD_SIZE, moveCount)) {
    console.log("Knight's tour is possible");
  } else {
    console.log("Knight's tour is not possible");
  }

  return board;
}

function renderChessBoard(board, container) {
  let theMoves = [];
  let haveZero = 0;
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j] === 0) {
        haveZero++;
      }
      const tmp = [board[i][j], i, j];
      theMoves.push(tmp);
    }
  }

  function renderNumber(index) {
    if (index >= 0 && index < theMoves.length) {
      const move = theMoves[index];
      const cellId = `box_${move[1]}_${move[2]}`;
      document.getElementById(
        cellId
      ).innerHTML = ` <i class="animate__animated  animate__slideInDown  knight fa-solid fa-chess-knight "></i> `;
      setTimeout(() => {
        document.getElementById(cellId).innerHTML = `${move[0]}`;
        renderNumber(index + 1);
      }, 1000);
    }
  }
  if (haveZero === 0) {
    theMoves.sort((a, b) => a[0] - b[0]);

    const html = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const cellContent = `<div id="box_${i}_${j}" class="${
          (i + j) % 2 === 0 ? "checkboard_white" : "checkboard_black"
        }"></div>`;
        html.push(cellContent);
      }
    }
    container.innerHTML = html.join("");
    renderNumber(0);
  } else {
    alert("Don't have Knight's Tour. Try another solution");
  }
}
