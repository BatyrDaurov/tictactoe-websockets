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

export const checkWin = (matrix) => {
  // Check win
  for (const condition of winningCombos) {
    let [a, b, c] = condition;

    if (matrix[a] && matrix[a] == matrix[b] && matrix[a] == matrix[c]) {
      return [a, b, c];
    }
  }
  return false;
};

export const checkTie = (matrix) => {
  for (let i = 0; i < matrix.length; i++) {
    if (matrix[i] === null) {
      return false;
    }
  }
  return true;
};
