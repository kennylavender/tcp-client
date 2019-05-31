# Kenny Lavender - Coding Challenge

## Run

- `npm install`
- `npm start`

## Test

- `npm run test-unit`
- `npm run test-integration`

## Branches

### master

A work in progress. I started decoupling the code by creating seperate components after getting the client mostly working in the `initial-working` branch.

This branch might be working, but I am unsure as I started having connection issues before testing completely.

### initial-working

This branch holds my original expirementation code that I created to get a good grasp of the requirements and components. The module does more than one thing is very coupled together and has no tests.

## Todo

- Extract and test request/response logic into a seperate module with tests.
- Some end to end tests, maybe mock stdin/stdout?
- Investigate a better composition of components? Can we use stream `.pipe` to improve composition or decoupling?
