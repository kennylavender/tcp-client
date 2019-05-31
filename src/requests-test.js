const test = require('tape');
const { createRequestManager } = require('./requests');

test('requestManager', t => {
  const requestManager = createRequestManager()

  const requests = [
    { "request": "time" },
    { "request": "time" },
    { "request": "count" },
    { "request": "time" },
    { "request": "count" }
  ].map(requestManager.push);

  t.deepEqual(
    requestManager.getRequestTypeById(requests[0].id),
    requests[0].request,
    'given the request exists; should return the request type'
  )

  t.deepEqual(
    requestManager.getRequestTypeById(requests[2].id),
    requests[2].request,
    'given the request exists; should return the request type'
  )
  
  t.deepEqual(
    requestManager.getRequestTypeById('foo'),
    undefined,
    'given the request does not exist; should return undefined'
  )

  t.deepEqual(
    requestManager.getRequestTypeById(null),
    undefined,
    'given null; should return undefined'
  )

  t.deepEqual(
    requestManager.getRequestTypeById({}),
    undefined,
    'given object; should return undefined'
  )
  
  t.end();
})

// test('renderTimeRequest', t => {

// })

// test('renderCountRequest', t => {

// })