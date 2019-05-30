const net = require("net");
const EventEmitter = require("events");
const {
  createHeartbeatTimeout,
  HEARTBEAT_TIMED_OUT
} = require("./heartbeat.js");
const { createResponseProcessor } = require("./processor.js");
const { pipe } = require("ramda");

const SOCKET_CONNECTING = "SOCKET_CONNECTING";
const SOCKET_RECONNECTING = "SOCKET_RECONNECTING";
const SOCKET_RECIEVED_RESPONSE = "SOCKET_RECIEVED_RESPONSE";
const SOCKET_TIMEOUT = "SOCKET_TIMEOUT";
const SOCKET_READY = "SOCKET_READY";
const SOCKET_HEARTBEAT_TIMEOUT = "SOCKET_HEARTBEAT_TIMEOUT";
const SOCKET_ERROR = "SOCKET_ERROR";

const createConnection = ({ port, host }) => {
  const emitter = new EventEmitter();
  let socket;
  const heartbeatTimeout = createHeartbeatTimeout({
    timeoutInMiliseconds: 2000
  });

  const sendStr = str => socket.write(Buffer.from(`${str}\n`, "utf8"));

  const sendJson = pipe(
    JSON.stringify,
    sendStr
  );

  const heartbeatTimedOut = () => {
    emitter.emit(SOCKET_HEARTBEAT_TIMEOUT);
    reconnect();
  };

  heartbeatTimeout.on(HEARTBEAT_TIMED_OUT, heartbeatTimedOut);

  const handleResponse = data => {
    heartbeatTimeout.push(data);
    emitter.emit(SOCKET_RECIEVED_RESPONSE, data);
  };

  const handleData = createResponseProcessor((err, data) => {
    if (!err) handleResponse(data);
  });

  const handleReady = () => {
    emitter.emit(SOCKET_READY);
    heartbeatTimeout.start();
  };

  const handleError = (err) => {
    emitter.emit(SOCKET_ERROR, err);
    console.log(err);
  };

  const handleTimeout = () => {
    emitter.emit(SOCKET_TIMEOUT)
  }

  const attachListeners = () => {
    socket.on("ready", handleReady);
    socket.on("data", handleData);
    socket.on("error", handleError);
    socket.on('timeout', handleTimeout);
    socket.on("close", removeListeners);
    socket.on("end", removeListeners);
  };

  const removeListeners = () => {
    socket.off("ready", handleReady);
    socket.off("data", handleData);
    socket.off("error", handleError);
    socket.off('timeout', handleTimeout);
    socket.off("close", removeListeners);
    socket.off("end", removeListeners);
  };

  const connect = () => {
    emitter.emit(SOCKET_CONNECTING);
    try {
      socket = net.createConnection({ port, host });
    } catch (e) {
      console.log(e);
    }
    socket.setTimeout(5000)
    attachListeners();
  };

  const reconnect = () => {
    emitter.emit(SOCKET_RECONNECTING);
    socket.end(() => {
      removeListeners();
      connect();
    });
  };

  return Object.assign(emitter, {
    sendJson,
    connect
  });
};

module.exports = {
  createConnection,
  SOCKET_CONNECTING,
  SOCKET_READY,
  SOCKET_RECONNECTING,
  SOCKET_HEARTBEAT_TIMEOUT,
  SOCKET_RECIEVED_RESPONSE
};
