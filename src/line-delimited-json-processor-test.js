const test = require("tape");
const createLineDelimitedJsonProcessor = require("./line-delimited-json-parser");

test("lineDelimitedJsonProcessor", t => {
  {
    let values = [];
    let errors = [];

    const callback = (err, data) => {
      if (err) errors.push(err);
      if (data) values.push(data);
    };

    const lineDelimitedJsonProcessor = createLineDelimitedJsonProcessor(
      callback
    );

    const inputChunks = [
      '{ "name": "foo" }',
      "\n",
      "{ baz: \n",
      '{ "request": "time" }\n',
      "{}\n",
      "foo\n",
      '{ "request": ',
      ' "count" }\n"'
    ];

    const expectedChunks = [
      { name: "foo" },
      { request: "time" },
      {},
      { request: "count" }
    ];

    inputChunks.forEach(lineDelimitedJsonProcessor);

    t.deepEqual(
      values,
      expectedChunks,
      "given valid inputChunks data; it should callback with the data of the correct chunks"
    );

    t.deepEqual(
      errors.length,
      2,
      "given invalid inputChunks data; it should callback errors for the correct chunks"
    );
  }
  t.end();
});
