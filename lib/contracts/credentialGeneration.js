import Contract from './contract';
import { accumulatorToBn, bnToString } from '../../utils/accumulator';

export default class CredentialGeneration extends Contract {
  addToAccumulator(credential) {
    const hash = this.web3.utils.sha3(credential.toString());
    const signatureObject = this.web3.eth.accounts.sign(hash, this.privateKey);
    const {
      message, messageHash, v, r, s,
    } = signatureObject;

    // TODO: we expect this to return a different address than initially
    // provided. `truffle develop` has a known issue with private keys.
    // for a temporary fix, re-run with the printed address
    const addr = this.web3.eth.accounts.recover(signatureObject);
    console.log(`🔨  DEBUG: address is ${addr}`);

    return this.contract.methods.addToAccumulator(
      message, messageHash, v, r, s,
    ).call({ from: this.fromAddress })
      .then(accumulatorToBn)
      .then(bnToString)
      .catch(err => console.log(err));
  }

  // returns accumulator announced by the EA
  getAccumulator() {
    return this.contract.methods.getAccumulator()
      .call({ from: this.fromAddress })
      .then(accumulatorToBn)
      .then(bnToString)
      .catch(err => console.log(err));
  }

  // returns accumulator modulus announced by the EA
  getAccumulatorModulus() {
    return this.contract.methods.getAccumulatorModulus()
      .call({ from: this.fromAddress })
      .then(accumulatorToBn)
      .then(bnToString)
      .catch(err => console.log(err));
  }
}
