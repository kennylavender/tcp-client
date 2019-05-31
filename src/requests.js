const cuid = require("cuid");
const { view, lensPath, is } = require("ramda");

const assignId = req => Object.assign({}, req, { id: cuid() });

const createRequestManager = () => {
  let requests = {};

  const push = req => {
    const request = assignId(req);
    requests[request.id] = request;
    return request;
  };

  const getRequestTypeById = id => view(lensPath([id, "request"]), requests);

  return {
    push,
    getRequestTypeById
  };
};

const getRequestIdFromResponse = response => {
  const value = view(lensPath(["msg", "reply"]), response);
  return is(String, value) ? value : undefined;
};

const formatTimeResponse = response => {
  const time = view(lensPath(["msg", "time"]), response);
  const randomNumber = view(lensPath(["msg", "random"]), response);
  return `Time: ${time}${
    randomNumber > 30 ? "\n\x1b[33mNumber is greater than 30!\x1b[0m" : ""
  }`;
};

const formatCountResponse = response =>
  `Count: ${view(lensPath(["msg", "count"]), response)}`;

module.exports = {
  createRequestManager,
  getRequestIdFromResponse,
  formatTimeResponse,
  formatCountResponse
};
