pragma solidity >=0.4.25 <0.6.0;

import {IPFS} from './IPFS.sol';
import {Timed} from './Timed.sol';

contract Registration is Timed {
  address public electionAuthority;

  string public ellipticCurve;
  string public hashFunction;

  IPFS.Multihash public votersHash;

  constructor (
    uint256 openingTime_,
    uint256 closingTime_,
    string memory ellipticCurve_,
    string memory hashFunction_
  ) public Timed(openingTime_, closingTime_) {
    // The caveat is that we have to expect voters to trust that address.
    // This risk is ongoing throughout the election - the address could get
    // compromised at any time.
    electionAuthority = msg.sender;

    // The EA deploys the elliptic curve and picks a hash function.
    // Use NIST specifications.
    ellipticCurve = ellipticCurve_;
    hashFunction = hashFunction_;
  }

  // getter for the hash function
  function getHashFunction() public view returns (string memory) {
    return hashFunction;
  }

  // getter for the elliptic curve
  function getEllipticCurve() public view returns (string memory) {
    return ellipticCurve;
  }

  // setter for the voter hash
  // can only set once.
  function setVotersHash(
    bytes32 _digest,
    uint8 _hashFunction,
    uint8 _size
  ) public {
    // does NOT require the phase to be open. Could be submitted once the
    // closing time is reached.
    require(votersHash.size == 0 && msg.sender == electionAuthority);
    votersHash = IPFS.Multihash(_digest, _hashFunction, _size);
  }
}
