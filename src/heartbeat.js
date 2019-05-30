const EventEmitter = require("events");
const HEARTBEAT_TIMED_OUT = "heartbeat::timed_out";

const createHeartbeatTimeout = ({ timeoutInMiliseconds = 2000 }) => {
  const emitter = new EventEmitter();
  let timeout;

  const handleTimeout = () => {
    emitter.emit(HEARTBEAT_TIMED_OUT);
  };

  const push = data => {
    if (data.type === "heartbeat") {
      clearTimeout(timeout);
      timeout = setTimeout(handleTimeout, timeoutInMiliseconds);
    }
  };

  const start = () => {
    timeout = setTimeout(handleTimeout, timeoutInMiliseconds);
  };

  return Object.assign(emitter, {
    start,
    push
  });
};

module.exports = {
  HEARTBEAT_TIMED_OUT,
  createHeartbeatTimeout
};
