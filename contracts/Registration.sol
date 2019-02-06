pragma solidity >=0.4.25 <0.6.0;

import {IPFS} from './IPFS.sol';

contract Registration {
  address public electionAuthority;

  uint256 public openingTime;
  uint256 public closingTime;

  string public ellipticCurve;
  string public hashFunction;

  IPFS.Multihash public votersHash;

  constructor (
    uint256 openingTime_,
    uint256 closingTime_,
    string memory ellipticCurve_,
    string memory hashFunction_
  ) public {
    // The require function should be used to ensure valid conditions,
    // such as inputs, or contract state variables are met,
    // or to validate return values from calls to external contracts
    require(
      openingTime_ >= block.timestamp,
      "Opening Time must be in the future."
    );
    require(
      closingTime_ > openingTime_,
      "Closing Time must be after Opening Time."
    );

    // EA's Ethereum address is broadcast
    electionAuthority = msg.sender;

    // The caveat is that we have to expect voters to trust that address.
    // This risk is ongoing throughout the election - the address could get
    // compromised at any time.
    openingTime = openingTime_;
    closingTime = closingTime_;

    // The EA deploys the elliptic curve and picks a hash function.
    // Use NIST specifications.
    ellipticCurve = ellipticCurve_;
    hashFunction = hashFunction_;
  }

  // implements the opening and closing of the time frame
  // determines whether or not the contract is valid when invoked
  function isOpen() public view returns (bool) {
    return block.timestamp >= openingTime && block.timestamp <= closingTime;
  }

  // TODO ...
  /* function getTimeLeft() public view returns (uint256) {
    return ...
  } */

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
