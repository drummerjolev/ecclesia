const Web3 = require('web3');

export default class {
  constructor(provider) {
    this.web3 = new Web3(provider);
  }
}
