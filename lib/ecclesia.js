const Web3 = require('web3');

export default class {
  constructor(provider, RegistrationJSON, fromAddress) {
    // cannot use async in constructor, returning IIFE
    return (async () => {
      try {
        const web3 = new Web3(provider);
        // make sure truffle develop is running, will otherwise error
        const networkId = await web3.eth.net.getId();
        const deployedAddress = RegistrationJSON.networks[networkId].address;
        this.registration = await new web3.eth.Contract(
          RegistrationJSON.abi,
          deployedAddress,
        );
        this.fromAddress = fromAddress;
      } catch (e) {
        // TODO: better error handling
        console.log(e);
      }
      return this;
    })();
  }

  // check if contract is valid or not
  isOpen() {
    return this.registration.methods.isOpen()
      .call({ from: this.fromAddress })
      .catch(err => console.log(err));
  }

  // check which hash function was announced by the EA
  getHashFunction() {
    return this.registration.methods.getHashFunction()
      .call({ from: this.fromAddress })
      .catch(err => console.log(err));
  }

  // check which elliptic curve was announced by the EA
  getEllipticCurve() {
    return this.registration.methods.getEllipticCurve()
      .call({ from: this.fromAddress })
      .catch(err => console.log(err));
  }
}
