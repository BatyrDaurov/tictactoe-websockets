export const resetBoard = (matrix) => {
  // Обнуляем доску
  matrix = Array(9).fill(null);

  $('#game-board td button').removeClass('touched').removeAttr('data-move-by');
};
