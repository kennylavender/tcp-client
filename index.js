const createClient = require('./src/client');

const host = "35.226.214.55";
const port = 9432;

createClient({ port, host })