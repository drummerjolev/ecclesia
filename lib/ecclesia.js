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
        return this;
      } catch (e) {
        // TODO: better error handling
        console.log(e);
      }
    })();
  }

  isOpen() {
    return this.registration.methods.isOpen()
    .call({ from: this.fromAddress })
    .catch(err => console.log(err));
  }
}
