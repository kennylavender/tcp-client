const EventEmitter = require("events");
const readline = require("readline");
const prettyjson = require("prettyjson");

const UI_USER_INPUT = "UI::USER_INPUT";

const createUI = ({ output = process.stdout, input = process.stdin } = {}) => {
  const emitter = new EventEmitter();
  const rl = readline.createInterface({
    input,
    output
  });

  const writeMessage = str => output.write(`\n${str}\n`);
  const writeJson = json => renderMessage(prettyjson.render(json));

  const onLine = line => {
    try {
      const data = JSON.parse(line);
      emitter.emit(UI_USER_INPUT, data);
      rl.prompt();
    } catch {
      writeMessage("Input must be valid JSON");
      rl.prompt();
    }
  };

  const prompt = () => {
    rl.prompt();
  };

  rl.on("line", onLine);

  return Object.assign(emitter, {
    prompt,
    writeMessage,
    writeJson
  });
};

module.exports = {
  UI_USER_INPUT,
  createUI
};
