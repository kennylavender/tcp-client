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

const getRequestIdFromResponse = (response) => {
  const value = view(lensPath(['msg', 'reply']), response);
  return is(String, value) ? value : undefined;
};

module.exports = {
  createRequestManager,
  getRequestIdFromResponse
};
