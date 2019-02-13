pragma solidity >=0.4.25 <0.6.0;

import {CredentialGeneration} from './CredentialGeneration.sol';
import {IPFS} from './IPFS.sol';
import {Timed} from './Timed.sol';

contract Commitment is Timed {
  address public electionAuthority;

  CredentialGeneration credentialGeneration;

  mapping(address => IPFS.Multihash) ballots;

  constructor(
    address cgAddress_,
    uint256 openingTime_,
    uint256 closingTime_
  ) public Timed(openingTime_, closingTime_) {
    electionAuthority = msg.sender;

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
    require(super.isOpen());
    // Placeholder for ZK proof
    // require(...)

    // every address can only submit one vote
    if (ballots[msg.sender].size == 0) {
      ballots[msg.sender] = IPFS.Multihash(_digest, _hashFunction, _size);
    }
  }

  // getter for accumulator
  // TODO: remove? contract addresses stored on client
  function getAccumulator() public view returns (uint256[8] memory) {
    return credentialGeneration.getAccumulator();
  }
}
