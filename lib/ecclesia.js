const Web3 = require('web3');

export default class {
  constructor(provider, Registration) {
    this.web3 = new Web3(provider);

    // setup Registration
    this.Registration = Registration;
    this.Registration.setProvider(provider);
  }
}
