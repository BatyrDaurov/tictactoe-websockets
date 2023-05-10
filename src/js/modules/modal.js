export const openModal = () => {
  $('#login').addClass('visible');
  $('body').addClass('lock');
  $('#login-room').hide();
  $('.login-bg').show();
};
export const closeModal = () => {
  $('#login').removeClass('visible');
  $('body').removeClass('lock');
  $('.login-bg').hide();
  $('#login-room').hide();
};
