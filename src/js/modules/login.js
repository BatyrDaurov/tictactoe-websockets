import { closeModal } from './modal';

export const formListener = (ws) => {
  // Разрешаем создать комнату при подключении к серверу
  ws.addEventListener('open', () => {
    $('#login-btn').text('Создать комнату').removeAttr('disabled');
  });

  // При клике на создать/подключиться кнопку
  $('#login-btn').on('click', () => {
    let inputName = $('#login-name').val();
    let inputRoom = $('#login-room').val();

    if ($('#form-checkbox').prop('checked')) {
      console.log('connect room');
      // Проверяем валидность введенного имени и комнаты
      if (inputName.length > 4 && inputRoom.length > 4) {
        $('#room-number').text(inputRoom);
        // Подключение к созданной комнате
        ws.send(
          JSON.stringify({
            event: 'room-connect',
            payload: {
              name: inputName,
              roomId: Number(inputRoom),
            },
          })
        );
        closeModal();
      }
    } else {
      console.log('create room');
      // Номер новой комнаты
      const newRoomId = Date.now();
      // Проверяем валидность введенного имени
      if (inputName.length > 4) {
        $('#room-number').text(newRoomId);
        // Создание собственной игры
        ws.send(
          JSON.stringify({
            event: 'room-connect',
            payload: {
              name: inputName,
              roomId: newRoomId,
            },
          })
        );
        closeModal();
      }
    }
  });
  // Чекбокс
  let loginCheckbox = $('.login__checkbox label');
  loginCheckbox.on('click', () => {
    if ($('#form-checkbox').prop('checked')) {
      $('#form-checkbox').prop('checked', true);
      $('.login__checkbox').removeClass('active');
      $('#login-room').hide();
      $('.login__btn').text('Создать комнату');
    } else {
      $('#form-checkbox').prop('checked', false);
      $('.login__checkbox').addClass('active');
      $('#login-room').show();
      $('.login__btn').text('Подключиться');
    }
  });
};
