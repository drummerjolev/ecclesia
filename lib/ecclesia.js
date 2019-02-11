const Web3 = require('web3');

export default class {
  constructor (provider, RegistrationJSON) {
    try {
      // TODO: is there a better way to do this?
      // should init be called from caller?
      this.init(provider, RegistrationJSON);
    } catch (e) {
      console.log(e);
    }
  }

  async init(provider, RegistrationJSON) {
    try {
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedAddress = RegistrationJSON.networks[networkId].address;
      const contractInstance = new web3.eth.Contract(
        RegistrationJSON.abi,
        deployedAddress,
      );

      // TODO: move to open class method
      contractInstance.methods.isOpen().call(
        { from: 0 },
        (err, res) => {
          if (!err) {
            console.log(res);
          } else {
            console.log(err);
          }
        },
      );
    } catch (e) {
      // TODO: better error handling
      console.log(e);
    }
  }
}
