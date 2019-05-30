const test = require('tape');
const {
  createHeartbeatTimeout
} = require('../src/heartbeat');
const sinon = require('sinon');

const pushHeartbeats = (heartbeatTimeout, interval, count) => {
  let i = 0;
  const sendHeartbeat = () => {
    if (i < count) {
      i = i + 1;
      heartbeatTimeout.push({ type: 'heartbeat', time: new Date().getTime() });
      setTimeout(sendHeartbeat, interval);
    }
  }
  return sendHeartbeat();
};

test('heartbeatTimeout', t => {
  {
    const timeoutInMiliseconds = 2000;
    const timeoutCallback = sinon.spy();
    const heartbeatTimeout = createHeartbeatTimeout({ timeoutInMiliseconds, timeoutCallback });
    
    heartbeatTimeout.start()

    pushHeartbeats(heartbeatTimeout, 1000, 10);

    setTimeout(() => {
      t.deepEqual(
        timeoutCallback.called,
        false,
        'given the heartbeats are being emitted within the timeout time; the timeout event should not have been emitted'
      )
    }, 5000)
    

    setTimeout(() => {
      t.deepEqual(
        timeoutCallback.calledOnce,
        true,
        'given heartbeats have stopped; the timeout event should have been emitted'
      )

      t.end();
    }, 15000)

    
  }
});