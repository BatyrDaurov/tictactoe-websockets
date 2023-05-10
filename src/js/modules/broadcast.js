import { checkTie, checkWin } from './checkWin';
import { resetBoard } from './resetBoard';

export const broadcast = (ws) => {
  let matrix = Array(9).fill(null);

  ws.onopen = () => {
    ws.onmessage = (e) => {
      // Получаем ответы с сервера
      const message = JSON.parse(e.data);

      // Смотрим что за ответ
      switch (message.type) {
        case 'connectToPlay':
          // Расставляем имена игроков
          $('#my-name').text(message.payload.name);
          $('#enemy-name').text(message.payload.enemyName || 'Соперника нет');
          // Изменяем подсказку
          if (message.payload.turn !== message.payload.name) {
            $('#prompt').text('ожидайте ход соперника');
          }
          // Разрешаем начать игру создателю комнаты
          if (
            message.payload.enemyName &&
            message.payload.turn == message.payload.name
          ) {
            $('#game-board').addClass('first-turn');
            $('#game-board td button').prop('disabled', false); // Включаем кнопки для начинающего
          }
          break;

        case 'roomMessage':
          // Добавляем пришедшее сообщение в чат
          $('#chat-list ul').append(`
            <li class="message ${
              message.payload.name === $('#my-name').text() && `message__me`
            }">
              <div class="chat-user message__user">
                <svg width="20" height="20" class="chat-user__icon">
                  <use xlink:href="./images/icons/icons.svg#chat-user"></use>
                </svg>
                <p class="chat-user__name">${message.payload.name}</p>
              </div>
              <p class="message__text">
                ${message.payload.text}
              </p>
            </li>
          `);
          break;

        case 'afterShoot':
          // Проходимся по всем ячейкам
          document
            .querySelectorAll('#game-board td button')
            .forEach((btn, index) => {
              // Помечаем выстреленную ячейку
              if (index === message.payload.cellIndex - 1) {
                if (message.payload.moveItem === 'x') {
                  btn.setAttribute('data-move-by', 'x');
                } else {
                  btn.setAttribute('data-move-by', 'o');
                }
                btn.classList.add('touched');
                btn.setAttribute('disabled', true);

                // Загружаем в нашу матрицу
                matrix[index] = message.payload.moveItem;
              }
              // Отключаем/включаем кнопки пользователю
              if (message.payload.turn === $('#my-name').text()) {
                btn.removeAttribute('disabled');
              } else {
                btn.setAttribute('disabled', true);
              }
            });

          // Изменяем подсказку
          if (message.payload.turn !== $('#my-name').text()) {
            $('#prompt').text('ожидайте ход соперника');
          } else {
            $('#prompt').text('ваш ход');
          }

          // Проверяем выигрыш
          if (message.payload.name === $('#my-name').text()) {
            if (checkWin(matrix)) {
              ws.send(
                JSON.stringify({
                  event: 'room-end-round',
                  payload: {
                    winner: message.payload.name,
                    roomId: $('#room-number').text(),
                  },
                })
              );
            } else if (checkTie(matrix)) {
              ws.send(
                JSON.stringify({
                  event: 'room-round-tie',
                  payload: {
                    roomId: $('#room-number').text(),
                  },
                })
              );
            }
          }

          break;

        case 'nextRound':
          // Обнуляем доску
          resetBoard(matrix);

          // Добавляем в счетчик побед
          if (message.payload.winner === $('#my-name').text()) {
            $('#me .player__matches-icon div:not(.filled)')
              .first()
              .addClass('filled');
          } else {
            $('#enemy .player__matches-icon div:not(.filled)')
              .first()
              .addClass('filled');
          }

          // Если это последний раунд, заканчиваем игру
          if (
            ($('#me .player__matches-icon div.filled').length === 3 ||
              $('#enemy .player__matches-icon div.filled').length === 3) &&
            message.payload.winner === $('#my-name').text()
          ) {
            ws.send(
              JSON.stringify({
                event: 'room-endgame',
                payload: {
                  winner: message.payload.winner,
                  roomId: $('#room-number').text(),
                },
              })
            );
          }
          break;
        case 'roundTie':
          // Обнуляем доску
          resetBoard(matrix);
          alert('Махайтесь до последнего');
          break;

        // Конец игры
        case 'endGame':
          alert(`${message.payload.winner}, won!!!🏆🏆🏆`);
          window.location.reload();
          break;

        // Выходим из игры если неизвестное сообщение
        default:
          window.location.reload();
          break;
      }
    };
  };
};
