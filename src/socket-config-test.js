const test = require("tape");

const { withSocketConfig } = require("./socket-config");

const createEnv = ({
  foo = "foo",
  BAR = "BAR",
  SERVER_PORT = "3435",
  SERVER_HOST = "localhost",
  ...rest
} = {}) => ({
  foo,
  BAR,
  ...rest
});

test("withSocketConfig", t => {
  {
    const env = createEnv();
    const config = { other: "other", baz: "baz" };
    t.deepEqual(
      withSocketConfig(env)(config),
      Object.assign({}, config, {
        socket: { port: env.SERVER_PORT, host: env.SERVER_HOST }
      }),
      "given env and a configuration object; it should extend to the configuration object with the correct socket properties"
    );
  }

  {
    const env = createEnv();
    t.deepEqual(
      withSocketConfig(env)(),
      {
        socket: { port: env.SERVER_PORT, host: env.SERVER_HOST }
      },
      "given no configuration object; it should return a new object with only the socket properties"
    );
  }
  t.end();
});
