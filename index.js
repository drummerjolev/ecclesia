import Web3 from 'web3';
import IPFS from 'ipfs';
import CredentialGeneration from './lib/contracts/credentialGeneration';
import Commitment from './lib/contracts/commitment';
import Registration from './lib/contracts/registration';
import Python from './lib/python';
import Storage from './lib/storage';

// ABI imports, compiled with `truffle build`
const registrationJson = require('./build/contracts/Registration.json');
const credentialGenerationJson = require(
  './build/contracts/CredentialGeneration.json',
);
const commitmentJson = require('./build/contracts/Commitment.json');

// Library serves as initializer for all libs that interact with contracts
// wraps singleton http provider and web3 objects
export class ContractLibrary {
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

  connectToCommitment() {
    return new Commitment(
      this.httpProvider,
      this.web3,
      commitmentJson,
      this.fromAddress,
      this.privateKey,
    );
  }
}

// StorageLibrary serves as initializer for the IPFS Library
// wraps singleton IPFS node
export class StorageLibrary {
  constructor() {
    this.node = new IPFS();
  }

  connectToStorage() {
    return new Storage(this.node);
  }
}

// PythonLibrary serves as initializer for the Python Library
// wraps the Python path, e.g. a path to a virtual environment
export class PythonLibrary {
  // pythonPath arg is provided as absolute
  // script arg is provided as relative to Ecclesia directory
  constructor(pythonPath, script) {
    this.pythonPath = pythonPath;
    this.script = script;
  }

  connectToPython() {
    return new Python(this.pythonPath, this.script);
  }
}
