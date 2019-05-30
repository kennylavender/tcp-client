const createResponseProcessor = ({ callback }) => {
  let buffered = ''
  return (data) => {
    buffered += data;
    var received = buffered.split("\n");
    while (received.length > 1) {
      try {
        const val = JSON.parse(received[0]);
        callback(null, val);
      } catch (err) {
        callback(new Error('Invalid input'))
      }
      buffered = received.slice(1).join("\n");
      received = buffered.split("\n");
    }
  }
}

module.exports = {
  createResponseProcessor
}