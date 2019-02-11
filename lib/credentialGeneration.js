import Contract from './contract';

export default class CredentialGeneration extends Contract {
  // returns accumulator announced by the EA
  getAccumulator() {
    return this.contract.methods.getAccumulator()
      .call({ from: this.fromAddress })
      .catch(err => console.log(err));
  }

  // returns accumulator modulus announced by the EA
  getAccumulatorModulus() {
    // TODO: use BN
    return this.contract.methods.getAccumulatorModulus()
      .call({ from: this.fromAddress })
      .catch(err => console.log(err));
  }
}
