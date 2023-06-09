import './libs/jquery.min.js';
import { broadcast } from './modules/broadcast.js';
import { formListener } from './modules/login.js';
import { openModal } from './modules/modal.js';
import { chat } from './modules/chat.js';
import { boardListener } from './modules/board.js';

$(function () {
  const ws = new WebSocket('wss://game-backend-hhff.onrender.com/ws/tictactoe');

  /* ==== Game Listener ==== */
  boardListener(ws);
  broadcast(ws);

  /* ==== Initialize ==== */
  openModal();
  formListener(ws);
  chat(ws);
});
