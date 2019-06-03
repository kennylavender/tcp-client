const createClient = require("./src/client");
const { withSocketConfig } = require("./src/socket-config");

const config = withSocketConfig(process.env)({});

createClient(config);
