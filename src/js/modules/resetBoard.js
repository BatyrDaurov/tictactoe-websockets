export const resetBoard = () => {
  // Обнуляем доску

  $('#game-board td button').removeClass('touched').removeAttr('data-move-by');
};
