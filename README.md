# express-app-testing-demo

[![Build Status](https://travis-ci.org/Treast/express-app-testing.svg?branch=master)](https://travis-ci.org/Treast/express-app-testing)
[![Coverage Status](https://coveralls.io/repos/github/Treast/express-app-testing/badge.svg?branch=develop)](https://coveralls.io/github/Treast/express-app-testing?branch=develop)

This project is a simple express app for demonstrating testing and code coverage.
[Jest](https://facebook.github.io/jest/) and
[Supertest](https://github.com/visionmedia/supertest) are used for testing.
Jest is also used for mocking functions and measuring code coverage.
Note that this app only focuses on server-side JavaScript testing.


## Conventions
- Vérifier avant chaque forEach que la variable utilisée est un type array, et que la longueur du tableau est supérieure à 0
- Utiliser ESLint et Prettier avec le preset d'AirBnb pour le formattage automatique du Javascript
- Utiliser des polyfills Javascript pour la retropcompatibilité jusqu'à IE9
- Tester en environnement de pré-production et demander une validation de la part du client avant de push sur l'environnement de production
- Utiliser la nomenclature PHPDoc pour la documentation de fonction et mettre des entêtes au début des fichiers

## Requirements

* Node.js - [https://nodejs.org/](https://nodejs.org/)


## Getting Started

* Clone the repo
* Install dependencies with `npm install`
* Run server with `npm start` and go here:
[http://localhost:3000/](http://localhost:3000/)


## Running Tests

* Run unit and integration tests: `npm test`
* Run end-to-end tests: `npm run test:e2e`

## Code Coverage Report

A new code coverage report is generated every time `npm test` runs.
Normally this coverage report is ignored by git.
This project includes it in source control so the coverage report can be viewed in the demo app:
[http://express-app-testing-demo.herokuapp.com/coverage/lcov-report/index.html](http://express-app-testing-demo.herokuapp.com/coverage/lcov-report/index.html)
