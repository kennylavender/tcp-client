const {
  createSocket,
  SOCKET_CONNECTING,
  SOCKET_READY,
  SOCKET_RECONNECTING,
  SOCKET_HEARTBEAT_TIMEOUT,
  SOCKET_RECIEVED_RESPONSE,
  SOCKET_ERROR
} = require("./socket");
const { createUI, UI_USER_INPUT } = require("./ui");
const { pipe, view, lensPath } = require("ramda");
const cuid = require("cuid");

const createClient = ({ port, host }) => {
  const ui = createUI();
  const socket = createSocket({ port, host });

  // todo, move requests logic to another module
  const requests = {};

  const makeRequest = obj => Object.assign({}, obj, { id: cuid() });

  const storeRequest = req => {
    requests[req.id] = req;
    return req;
  };

  const requestExistsById = id => !!requests[id];

  const onUserInput = pipe(
    makeRequest,
    storeRequest,
    socket.sendJson
  );

  const onSocketConnecting = () => {
    ui.writeMessage("Connecting...");
  };

  const onSocketReconnecting = () => {
    ui.writeMessage("Reconnecting...");
  };

  const onSocketReady = () => {
    ui.writeMessage("Ready! Logging in...");
    socket.sendJson({ name: "kenny" });
  };

  const onSocketHeartbeatTimeout = () => {
    ui.writeMessage("Heartbeat timed out...");
  };

  const onSocketError = err => {
    console.log(err);
    process.exit(1);
  };

  const handleMessageData = data => {
    if (
      data.type === "msg" &&
      requestExistsById(view(lensPath(['msg', 'reply'])))
    ) {
      if (view(lensPath(['msg', 'ramdom'])) > 30) {
        ui.writeMessage('Random value is higher than 30');
      }
      ui.writeJson(data);
      ui.prompt();
    }
  };

  const handleLoginSuccessData = data => {
    if (data.type === "welcome") {
      ui.writeMessage(data.msg);
      ui.prompt();
    }
  };

  ui.on(UI_USER_INPUT, onUserInput);
  socket.on(SOCKET_CONNECTING, onSocketConnecting);
  socket.on(SOCKET_READY, onSocketReady);
  socket.on(SOCKET_ERROR, onSocketError);
  socket.on(SOCKET_RECONNECTING, onSocketReconnecting);
  socket.on(SOCKET_HEARTBEAT_TIMEOUT, onSocketHeartbeatTimeout);
  socket.on(SOCKET_RECIEVED_RESPONSE, handleMessageData);
  socket.on(SOCKET_RECIEVED_RESPONSE, handleLoginSuccessData);

  socket.connect();
};

module.exports = createClient;
