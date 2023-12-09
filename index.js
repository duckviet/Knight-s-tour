let BOARD_SIZE; //Kích thước bàn cờ
let XstartVal;
let YstartVal;
let HaveKnightTour = 0;

// Hàm sẽ được gọi sau khi điền nhấn "Start the Knight's Tour"
function SubmitFunc() {
  // const nValue = parseInt(document.getElementById("inputN").value);
  const nValue = 8;
  // Lấy vị trí ban đầu nhập vào
  const xValue = parseInt(document.getElementById("inputX").value);
  const yValue = parseInt(document.getElementById("inputY").value);

  BOARD_SIZE = nValue;
  XstartVal = xValue;
  YstartVal = yValue;
  // Kiểm tra nếu vị trí nhập vào vượt qua điều kiện cho trước
  if (
    !(XstartVal >= 0 && XstartVal < 8) ||
    !(YstartVal >= 0 && YstartVal < 8)
  ) {
    // Thông báo vị trí không phù hợp
    console.log("Start position is not valid. Try again");
    alert("Don't have Knight's Tour. Try another solution");
    return;
  } else {
    // Xử lí tạo bàn cờ
    const boardContainer = document.getElementById("board");
    boardContainer.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;
    boardContainer.style.gridTemplateRows = `repeat(${BOARD_SIZE}, 1fr)`;

    // Đưa vị trí ban đầu vào hàm knightTour để xử lí (Phần xử lí bài toán)
    const finalBoard = knightTour(XstartVal, YstartVal);

    // Kiểm tra có giải pháp không
    if (HaveKnightTour === 1) {
      // (Phần giao diện )
      renderChessBoard(finalBoard, boardContainer);
    } else {
      alert("Don't have Knight's Tour. Try another solution");
    }
  }
}

// Hàm tìm các bước đi hợp lệ cho quân mã trên bàn cờ tại vị trí hiện tại
function validMoves(row, col, board, N) {
  const moves = []; // Mảng tất cả các bước đi hợp lệ tại vị trí hiện tại
  const rowMoves = [-2, -1, 1, 2, 2, 1, -1, -2];
  const colMoves = [1, 2, 2, 1, -1, -2, -2, -1];

  // Duyệt qua tất cả các bước có thể
  for (let i = 0; i < 8; i++) {
    const newRow = row + rowMoves[i];
    const newCol = col + colMoves[i];
    // Kiểm tra xem bước đi có nằm trong bàn cờ và ô đó chưa được đi qua chưa
    if (
      newRow >= 0 &&
      newRow < N &&
      newCol >= 0 &&
      newCol < N &&
      board[newRow][newCol] === 0
    ) {
      // Nếu chưa thì thêm bước đi hợp lệ vào mảng
      moves.push([newRow, newCol]);
    }
  }
  return moves; // Trả về mảng các bước đi hợp lệ
}

/*
Hàm quay lui:
Nhận thấy rằng số lượng cách hoàn thành knight's tour tại mỗi địa điểm trên bàn cờ kích thước 8x8 là rất lớn.
Vì vậy, hàm solve được cài đặt để trả về true ngay khi tìm được đường đi đầu tiên. Ngược lại, nếu không tìm 
thấy, hàm sẽ trả về false. Hàm solve() cũng sử dụng hàm sort để lựa chọn trong các bước đi có thể đi, bước đi nào 
có ít nhất số bước đi hợp lệ tiếp theo. Việc lựa chọn bước đi này sẽ tối ưu hơn.
*/
function solve(row, col, moveNum, board, N) {
  board[row][col] = moveNum; // Gán bước đi hiện tại vào vị trí trên bảng
  if (moveNum === N * N) return true; // Nếu tất cả bước đi đã hoàn thành, trả lại true

  const moves = validMoves(row, col, board, N); // Tạo một mảng các bước đi hợp lệ cho vị trí hiện tại
  // Sắp xếp các bước đi theo số bước đi hợp lệ từ mỗi vị trí tăng dần
  moves.sort(
    (a, b) =>
      validMoves(a[0], a[1], board, N).length -
      validMoves(b[0], b[1], board, N).length
  );
  // Duyệt qua các bước đi đã được sắp xếp
  for (const move of moves) {
    const [newRow, newCol] = move;
    if (solve(newRow, newCol, moveNum + 1, board, N)) {
      return true; // Nếu tìm thấy , trả về true
    }
  }
  // Nếu không tìm thấy từ vị trí hiện tại, backtracking
  board[row][col] = 0;
  return false;
}

// Hàm tạo bàn cờ
function knightTour(startRow, startCol) {
  // Tạo bàn cờ ban đầu với kích thước cho trướtrước, tất cả giá trị = 0
  const board = Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(0)
  );
  //Kiểm tra
  if (solve(startRow, startCol, 1, board, BOARD_SIZE)) {
    console.log("Knight's tour is possible");
    HaveKnightTour = 1;
    //In bàn cờ ra console.log
    console.log("Board\n", board.map((row) => row.join(" ")).join("\n "));
  } else {
    console.log("Knight's tour is not possible");
  }

  return board;
}

// Phần xử lí giao diện, render bàn cờ
function renderChessBoard(board, container) {
  //Render con mã theo thứ tự đánh số mỗi .5s
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
      }, 500);
    }
  }
  let theMoves = []; // Mảng chứa các bước đi
  // Tạo một vòng lặp lặp qua bàn cờ để lấy bước đi và vị trí tương ứngứng
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const tmp = [board[i][j], i, j];
      theMoves.push(tmp);
    }
  }
  theMoves.sort((a, b) => a[0] - b[0]); // sort lại cho đúng thứ tự

  // In ra các bước đi theo thứ tự
  console.log(
    "Step by step:\n",
    theMoves
      .map((move, index) => `s${index + 1}(${move.slice(1, 3).join(" ")})`)
      .join(" -> ")
  );
  //Tạo các ô cờ theo màu dựa trên vị trí
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
}
