import { default as Web3 } from 'web3';
import Registration from './lib/registration';
import CredentialGeneration from './lib/credentialGeneration';

const registrationJson = require('./build/contracts/Registration.json');
const credentialGenerationJson = require(
  './build/contracts/CredentialGeneration.json',
);

export default class Library {
  constructor(host, port, fromAddress) {
    this.httpProvider = new Web3.providers.HttpProvider(
      `http://${host}:${port}`,
    );
    this.web3 = new Web3(this.httpProvider);
    this.fromAddress = fromAddress;
  }

  connectToRegistration() {
    return new Registration(
      this.httpProvider,
      this.web3,
      registrationJson,
      this.fromAddress,
    );
  }

  connectToCredentialGeneration() {
    return new CredentialGeneration(
      this.httpProvider,
      this.web3,
      credentialGenerationJson,
      this.fromAddress,
    );
  }
}
