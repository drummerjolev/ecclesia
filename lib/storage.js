// wraps interactions with IPFS
// See: https://ipfs.io, https://github.com/ipfs/js-ipfs
export default class Storage {
  // Helper for constructor, promisifies the IPFS API
  _connectToIPFS(ipfsNode) {
    return new Promise((done, reject) =>
      ipfsNode.on('ready', async () => {
        // check for error-free node
        ipfsNode.version(
          (err, version) => (err ? reject(err) : done(ipfsNode))
        )
      })
    );
  }

  constructor(ipfsNode) {
    return (async () => {
      try {
        this.node = await this._connectToIPFS(ipfsNode);
      } catch (e) {
        // TODO: better error handling
        console.log(e);
      }
      return this;
    })();
  }
}
