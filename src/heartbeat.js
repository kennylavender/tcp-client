const createHeartbeatTimeout = ({ timeoutInMiliseconds = 2000, timeoutCallback }) => {
  let timeout;

  const handleTimeout = () => {
    timeoutCallback();
  }

  const push = (data) => {
    if (data.type === 'heartbeat') {
      clearTimeout(timeout);
      timeout = setTimeout(
        handleTimeout,
        timeoutInMiliseconds
      );
    }
  };

  const start = () => {
    timeout = setTimeout(
      handleTimeout,
      timeoutInMiliseconds
    );
  }

  return {
    start,
    push,
  }
};


module.exports = {
  createHeartbeatTimeout,
};
