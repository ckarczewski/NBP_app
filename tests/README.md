# E2E tests
### Setup tests
`npm install` – install packages<br>
`cp .env.example .env` – copy & fill .env file (for local usage)<br>

### Running tests
`npx playwright test`

### Open the last HTML report
`npx playwright show-report`

### Retake screenshots on your local (use only if UI changed + check it visually before committing!)
`npx playwright test --update-snapshots`

### Retake screenshots on Ubuntu 20.04 – CI OS (use only if UI changed + check it visually before committing!)
`docker run --rm --network host -v "$(pwd):/work/" -w /work/ -it mcr.microsoft.com/playwright:v1.29.2-focal /bin/bash`<br>
`npm install`<br>
`npx playwright test --update-snapshots`