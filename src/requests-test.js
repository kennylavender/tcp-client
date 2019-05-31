const test = require("tape");
const {
  createRequestManager,
  getRequestIdFromResponse
} = require("./requests");

test("requestManager", t => {
  const requestManager = createRequestManager();

  const requests = [
    { request: "time" },
    { request: "time" },
    { request: "count" },
    { request: "time" },
    { request: "count" }
  ].map(requestManager.push);

  t.deepEqual(
    requestManager.getRequestTypeById("foo"),
    undefined,
    "given the request does not exist; should return undefined"
  );

  t.deepEqual(
    requestManager.getRequestTypeById(null),
    undefined,
    "given null; should return undefined"
  );

  t.deepEqual(
    requestManager.getRequestTypeById({}),
    undefined,
    "given object; should return undefined"
  );

  t.deepEqual(
    requestManager.getRequestTypeById(requests[0].id),
    requests[0].request,
    "given the request exists; should return the request type"
  );

  t.deepEqual(
    requestManager.getRequestTypeById(requests[2].id),
    requests[2].request,
    "given the request exists; should return the request type"
  );

  t.end();
});

test("getRequestIdFromResponse", t => {
  const requestManager = createRequestManager();

  t.deepEqual(
    getRequestIdFromResponse(null),
    undefined,
    "given null; should return undefined"
  );

  t.deepEqual(
    getRequestIdFromResponse({}),
    undefined,
    "given empty object; should return undefined"
  );

  t.deepEqual(
    getRequestIdFromResponse({ msg: { reply: {} } }),
    undefined,
    "given an object where reply is an object instead of an id; should return undefined"
  );

  t.deepEqual(
    getRequestIdFromResponse({ msg: { reply: "foo" } }),
    "foo",
    "given a valid response; should return the request id"
  );

  t.end();
});

// test('getResponse', t => {

// })

// test('renderCountRequest', t => {

// })
