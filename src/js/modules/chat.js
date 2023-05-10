export const chat = (ws) => {
  // Открыть/закрыть чат
  $('#chat-btn').on('click', () => {
    $('#chat-list').toggleClass('hidden');
  });
  // Отправка сообщений
  $('#input-message').keyup((event) => {
    if (event.which === 13) {
      ws?.send(
        JSON.stringify({
          event: 'room-chat-send',
          payload: {
            text: $('#input-message').val(),
            name: $('#my-name').text(),
            roomId: $('#room-number').text(),
          },
        })
      );
      $('#input-message').val('');
    }
  });
};
