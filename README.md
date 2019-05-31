# Kenny Lavender - Coding Challenge

## Run

- `npm install`
- `npm start`

## Test

- `npm run test`

or 

- `npm run test-unit`
- `npm run test-integration`

## Branches

### master

A work in progress. I started decoupling the code by creating seperate components after getting the client mostly working in the `initial-working` branch.

This branch might be working, but I am unsure as I started having connection issues before testing completely.

### initial-working

This branch holds my original expirementation code that I created to get a good grasp of the requirements and required logic. The module does more than one thing and has logic that needs to be extracted and tested.

## Todo

- Some end to end tests, maybe mock stdin/stdout of the ui or just watch and push info to stdin/stdout?
  - In the case of this project, it would be fairly painfull to try this as the server's heartbeat is timing out frequently.
- Investigate a better composition of components? Can we use stream `.pipe` to improve composition?
- Missing non-happy path tests.
- Adjust package.json scripts to work on windows.
- Add linting
