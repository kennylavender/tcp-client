const test = require("tape");
const { createResponseProcessor } = require("./processor");

test("responseProcessor", t => {
  {
    let values = [];
    let errors = [];

    const callback = (err, data) => {
      if (err) errors.push(err);
      if (data) values.push(data);
    };

    const responseProcessor = createResponseProcessor(callback);

    const stream = [
      '{ "name": "foo" }',
      "\n",
      "{ baz: \n",
      '{ "request": "time" }\n',
      "{}\n",
      "foo\n",
      '{ "request": ',
      ' "count" }\n"'
    ];

    const expectedValues = [
      { name: "foo" },
      { request: "time" },
      {},
      { request: "count" }
    ];

    stream.forEach(responseProcessor);

    t.deepEqual(
      values,
      expectedValues,
      "given valid stream data; it should callback with the data of the correct chunks"
    );

    t.deepEqual(
      errors.length,
      2,
      "given invalid stream data; it should callback errors for the correct chunks"
    );
  }
  t.end();
});
