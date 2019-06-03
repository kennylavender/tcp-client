const withSocketConfig = (env = process.env) => config =>
  Object.assign({}, config, {
    socket: {
      port: env.SERVER_PORT,
      host: env.SERVER_HOST
    }
  });

module.exports = {
  withSocketConfig
};
