pragma solidity >=0.4.25 <0.6.0;

import {CredentialGeneration} from './CredentialGeneration.sol';

contract Commitment {
  // TODO: move to library
  // stores IPFS hashes
  // see: https://bit.ly/2SbuouC
  struct Multihash {
    bytes32 digest;
    uint8 hashFunction;
    uint8 size;
  }

  uint256 public openingTime;
  uint256 public closingTime;

  address public electionAuthority;

  CredentialGeneration credentialGeneration;

  mapping(address => Multihash) ballots;

  constructor(
    address cgAddress_,
    uint256 openingTime_,
    uint256 closingTime_
  ) public {
    require(
      openingTime_ >= block.timestamp,
      "Opening Time must be in the future."
    );
    require(
      closingTime_ > openingTime_,
      "Closing Time must be after Opening Time."
    );

    electionAuthority = msg.sender;

    openingTime = openingTime_;
    closingTime = closingTime_;

    // initialize to other contract address
    credentialGeneration = CredentialGeneration(cgAddress_);
  }

  // Ballot is committed
  // the ZK proof of knowledge is NOT implemented
  // Voter submits time-locked vote to IPFS, hash is stored here
  function vote(
    bytes32 _digest,
    uint8 _hashFunction,
    uint8 _size
  ) public {
    require(block.timestamp >= openingTime && block.timestamp <= closingTime);
    // Placeholder for ZK proof
    // require(...)

    // every address can only submit one vote
    if (ballots[msg.sender].size == 0) {
      ballots[msg.sender] = Multihash(_digest, _hashFunction, _size);
    }
  }

  // getter for accumulator
  // TODO: (probably) change type
  function getAccumulator() public view returns (uint256) {
    return credentialGeneration.getAccumulator();
  }
}
