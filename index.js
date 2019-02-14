import { default as Web3 } from 'web3';
import Registration from './lib/registration';
import CredentialGeneration from './lib/credentialGeneration';

// ABI imports, compiled with `truffle build`
const registrationJson = require('./build/contracts/Registration.json');
const credentialGenerationJson = require(
  './build/contracts/CredentialGeneration.json',
);

// Library serves as initializer for all libs that interact with contracts
// wraps singleton http provider and web3 objects
export default class Library {
  constructor(host, port, fromAddress, privateKey) {
    this.httpProvider = new Web3.providers.HttpProvider(
      `http://${host}:${port}`,
    );
    this.web3 = new Web3(this.httpProvider);
    this.fromAddress = fromAddress;
    this.privateKey = privateKey;
  }

  connectToRegistration() {
    return new Registration(
      this.httpProvider,
      this.web3,
      registrationJson,
      this.fromAddress,
      this.privateKey,
    );
  }

  connectToCredentialGeneration() {
    return new CredentialGeneration(
      this.httpProvider,
      this.web3,
      credentialGenerationJson,
      this.fromAddress,
      this.privateKey,
    );
  }
}
