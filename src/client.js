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
const { pipe } = require("ramda");
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

  const onSocketRecievedResponse = data => {
    if (
      data.type === "msg" &&
      data.msg &&
      data.msg.reply &&
      requestExistsById(data.msg.reply)
    ) {
      ui.writeJson(data);
    }
  };

  const watchForLoginSuccess = data => {
    if (data.type === "welcome") {
      ui.writeMessage(data.msg);
      ui.prompt();
    }
  };

  console.log(SOCKET_ERROR);

  ui.on(UI_USER_INPUT, onUserInput);
  socket.on(SOCKET_CONNECTING, onSocketConnecting);
  socket.on(SOCKET_READY, onSocketReady);
  socket.on(SOCKET_ERROR, onSocketError);
  socket.on(SOCKET_RECONNECTING, onSocketReconnecting);
  socket.on(SOCKET_HEARTBEAT_TIMEOUT, onSocketHeartbeatTimeout);
  socket.on(SOCKET_RECIEVED_RESPONSE, onSocketRecievedResponse);
  socket.on(SOCKET_RECIEVED_RESPONSE, watchForLoginSuccess);

  socket.connect();
};

module.exports = createClient;
