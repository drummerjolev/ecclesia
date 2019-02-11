import Contract from './contract';

export default class Registration extends Contract {
  // returns hash function announced by the EA
  getHashFunction() {
    return this.contract.methods.getHashFunction()
      .call({ from: this.fromAddress })
      .catch(err => console.log(err));
  }

  // returns elliptic curve announced by the EA
  getEllipticCurve() {
    return this.contract.methods.getEllipticCurve()
      .call({ from: this.fromAddress })
      .catch(err => console.log(err));
  }
}
