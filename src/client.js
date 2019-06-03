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
const {
  createRequestManager,
  getRequestIdFromResponse,
  formatCountResponse,
  formatTimeResponse
} = require("./requests");

const createClient = config => {
  const ui = createUI();
  const socket = createSocket(config.socket);
  const requestManager = createRequestManager();

  const onUserInput = pipe(
    requestManager.push,
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

  const renderCountResponse = response => {
    ui.writeMessage(formatCountResponse(response));
    ui.prompt();
  };

  const renderTimeResponse = response => {
    ui.writeMessage(formatTimeResponse(response));
    ui.prompt();
  };

  const handleMessageData = data => {
    if (data.type === "msg") {
      const type = requestManager.getRequestTypeById(
        getRequestIdFromResponse(data)
      );
      switch (type) {
        case "count":
          return renderCountResponse(data);
        case "time":
          return renderTimeResponse(data);
        default:
          return;
      }
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
