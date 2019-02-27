// wraps interactions with IPFS
// See: https://ipfs.io, https://github.com/ipfs/js-ipfs
export default class Storage {
  // Helper for constructor, promisifies the IPFS API
  static connectToIPFS(ipfsNode) {
    return new Promise((done, reject) => ipfsNode.on('ready', async () => {
      // check for error-free node
      ipfsNode.version(err => (err ? reject(err) : done(ipfsNode)));
    }));
  }

  constructor(ipfsNode) {
    return (async () => {
      try {
        this.node = await Storage.connectToIPFS(ipfsNode);
      } catch (e) {
        // TODO: better error handling
        console.log(e);
      }
      return this;
    })();
  }

  // returns path and IPFS hash for stored file
  write(name, utf8content) {
    return this.node
      .add({ path: name, content: Buffer.from(utf8content) })
      .then(ipfsFile => ipfsFile[0])
      .catch(err => console.log(err));
  }

  // returns saved file
  read(hash) {
    return this.node
      .cat(hash)
      .then(bufferedContent => bufferedContent.toString())
      .catch(err => console.log(err));
  }

  // stop blocking connection to IPFS network
  stop() {
    if (this.node) {
      this.node
        .stop()
        // HACK: this is currently broken, so we use Node directly
        .then(() => process.exit(0))
        .catch(err => console.log(err));
    }
  }
}
