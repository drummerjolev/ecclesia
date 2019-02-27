export default class Contract {
  constructor(provider, web3instance, json, fromAddress, privateKey) {
    // cannot use async in constructor, returning IIFE
    return (async () => {
      try {
        this.web3 = web3instance;

        // make sure truffle develop is running, will otherwise error
        const networkId = await this.web3.eth.net.getId();
        const deployedAddress = json.networks[networkId].address;
        this.contract = await new this.web3.eth.Contract(
          json.abi,
          deployedAddress,
        );

        this.fromAddress = fromAddress;
        // necessary for EC signing
        this.privateKey = privateKey;
      } catch (e) {
        // TODO: better error handling
        console.log(e);
      }
      return this;
    })();
  }

  // returns if contract is open or closed
  isOpen() {
    return this.contract.methods.isOpen()
      .call({ from: this.fromAddress })
      .catch(err => console.log(err));
  }
}
