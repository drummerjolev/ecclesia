# E-cclesia Implementation using Time Lock Puzzles

## Getting Started

This repository contains code that implements the E-cclesia anonymous voting protocol.

**Instructions**:

Prerequisites: [Node](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/en/)

1. `cd` into this repo then install dependencies with `yarn install`

2. Contracts must be compiled before they can be published on an Ethereum-compatible blockchain. You can use `truffle compile` or `truffle build`. For help and more information, refer to the [Truffle documentation](https://truffleframework.com/docs/truffle/getting-started/compiling-contracts).

3. Run a local Ethereum-blockchain. This repo was tested using [Ganache](https://truffleframework.com/ganache). `truffle develop` will start a chain on localhost unless configured otherwise. Once in the [Truffle console](https://truffleframework.com/docs/truffle/getting-started/using-truffle-develop-and-the-console), use `migrate --reset` to publish all contracts to your local blockchain.

4. If all steps above completed successfully, the CLI is now ready to use! Use `yarn run ecclesia` to get started.

## Production

DO NOT USE THIS IN PRODUCTION. This is a proof concept and is by no means guaranteed to be secure whatsoever. The aim of this implementation is to provide a prototype for further development. Please contact the E-cclesia team if you have any interest in using this.

## Versioning

**Version 0.9** (using [SemVer](https://semver.org/))

Breaking changes might occur.

## Authors

* **Jonathan Levi** - @drummerjolev

Thanks to [Myrto Arapinis](https://www.inf.ed.ac.uk/people/staff/Myrto_Arapinis.html), my project supervisor.

## License

Free to use, re-distribute with attribution. Basically, be nice and don't be a jerk.
