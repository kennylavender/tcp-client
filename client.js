const net = require("net");
const readline = require("readline");
const prettyjson = require("prettyjson");

const pipe = (...fns) => x => fns.reduce((acc, cur) => cur(acc), x);

const createClient = ({
  port,
  host,
  input = process.stdin,
  output = process.stdout,
  heartbeatTimeoutInMiliseconds = 2000
}) => {
  let socket;
  let buffered = "";
  let heartbeatTimeout;

  const userInput = readline.createInterface({
    input,
    output
  });

  const sendStrToServer = str => socket.write(Buffer.from(`${str}\n`, "utf8"));
  
  const sendJsonToServer = pipe(
    JSON.stringify,
    sendStrToServer
  );

  const renderUserMessage = str => output.write(`\n${str}\n`);

  const handleUserInput = data => {
    try {
      const json = JSON.parse(data);
      sendJsonToServer(json);
      userInput.prompt();
    } catch {
      renderUserMessage("Input must be valid JSON");
      userInput.prompt();
    }
  };

  userInput.on("line", handleUserInput);

  const heartbeatTimedOut = () => {
    renderUserMessage("Heartbeat timed out");
    socket.end(() => {
      cleanupSocket();
      createNewSocket();
    });
  };

  const heartbeat = () => {
    clearTimeout(heartbeatTimeout);
    heartbeatTimeout = setTimeout(
      heartbeatTimedOut,
      heartbeatTimeoutInMiliseconds
    );
  };

  const renderServerResponse = (data) => {
    renderUserMessage(prettyjson.render(data));
  };

  const handleServerResponse = str => {
    try {
      const data = JSON.parse(str);
      if (data.type === "heartbeat") return heartbeat();
      if (data.type === "welcome") return loginSuccess(data)
      renderServerResponse(data);
      userInput.prompt();
    } catch {
      renderUserMessage("Invalid server response");
      userInput.prompt();
    }
  };

  const processServerStream = () => {
    var received = buffered.split("\n");
    while (received.length > 1) {
      handleServerResponse(received[0]);
      buffered = received.slice(1).join("\n");
      received = buffered.split("\n");
    }
  };

  const handleServerStream = data => {
    buffered += data;
    processServerStream();
  };

  const loginSuccess = ({ msg }) => {
    renderUserMessage(msg);
    userInput.prompt();
  }

  const login = () => {
    renderUserMessage("Logging in...");
    sendJsonToServer({ name: "kenny" });
  };

  const handleConnectionReady = () => {
    renderUserMessage("Connected!");
    login();
    
  };

  const handleSocketError = (err) => {
    console.error(err);
    process.exit(1);
  }

  const createNewSocket = () => {
    renderUserMessage("Connecting...");
    socket = net.createConnection({ port, host });

    socket.on("ready", handleConnectionReady);
    socket.on("data", handleServerStream);
    socket.on('error', handleSocketError);
  };

  const cleanupSocket = () => {
    socket.off("ready", handleConnectionReady);
    socket.off("data", handleServerStream);
    socket.off('error', handleSocketError);
  };

  createNewSocket();
};

module.exports = createClient;
