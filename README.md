# TCP Client

A line delimited json based tcp client.

## Run
- Copy `.env-example` to `.env` and set real values.
- `npm install`
- `npm start`

## Test

- `npm run test`

or 

- `npm run test-unit`
- `npm run test-integration`

## Todo

- Setup circleci to run tests
- Some end to end tests, maybe mock stdin/stdout of the ui or just watch and push info to stdin/stdout?
- Investigate a better composition of components? Can we use stream `.pipe` to improve composition?
- Missing non-happy path tests.
- Adjust package.json scripts to work on windows.
- Add linting
- auth logic should go in its own module.
