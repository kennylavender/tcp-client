const cuid = require('cuid');
const { view, lensPath } = require('ramda');

const assignId = req => Object.assign({}, req, { id: cuid() })

const createRequestManager = () => {
  let requests = {};

  const push = (req) => {
    const request = assignId(req)
    requests[request.id] = request;
    return request;
  };

  const getRequestTypeById = (id) => view(lensPath([id, 'request']), requests);

  return {
    push,
    getRequestTypeById
  }
}

module.exports = {
  createRequestManager
}