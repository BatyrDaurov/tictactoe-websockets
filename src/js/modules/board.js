export const boardListener = (ws) => {
  // Проходимся по всем ячейкам
  document.querySelectorAll('#game-board td button').forEach((btn, index) => {
    // При клике на ячейку
    btn.onclick = () => {
      btn.classList.add('touched'); // Добавляем класс нажатой кнопки
      btn.setAttribute('disabled', true); // Отключаем ячейку

      // Отправляем на сервер
      ws.send(
        JSON.stringify({
          event: 'room-shoot',
          payload: {
            cellIndex: index + 1,
            name: $('#my-name').text(),
            roomId: $('#room-number').text(),
            moveItem: $('#game-board').hasClass('first-turn') ? 'x' : 'o',
          },
        })
      );
    };
  });
};
