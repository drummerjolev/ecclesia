import Contract from './contract';
import { getMultihashFromHash } from '../../utils/multihash';

export default class Commitment extends Contract {
  // submits IPFS hash for commitment
  vote(hash) {
    const { digest, hashFunction, size } = getMultihashFromHash(hash);
    return this.contract.methods.vote(
      digest, hashFunction, size,
    ).send({ from: this.fromAddress })
      .catch(err => console.log(err));
  }
}
