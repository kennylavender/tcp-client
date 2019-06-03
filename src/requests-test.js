const test = require("tape");
const {
  createRequestManager,
  getRequestIdFromResponse,
  formatTimeResponse,
  formatCountResponse
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

test("formatTimeResponse", t => {
  t.deepEqual(
    formatTimeResponse({ msg: { time: "Monday", random: 29 } }),
    "Time: Monday",
    "given a time response and random is below 30, should return the correct output string"
  );

  t.deepEqual(
    formatTimeResponse({ msg: { time: "Monday", random: 31 } }),
    "Time: Monday\n\x1b[33mNumber is greater than 30!\x1b[0m",
    "given a random number is greater than 30, should return the correct output string with a number notice"
  );

  t.end();
});

test("formatCountResponse", t => {
  t.deepEqual(
    formatCountResponse({ msg: { count: 3 } }),
    "Count: 3",
    "given a count response, should return the correct output string"
  );

  t.end();
});
