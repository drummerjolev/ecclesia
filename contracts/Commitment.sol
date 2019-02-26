pragma solidity >=0.4.25 <0.6.0;

import {IPFS} from './IPFS.sol';
import {Timed} from './Timed.sol';

contract Commitment is Timed {
  address public electionAuthority;

  mapping(address => IPFS.Multihash) ballots;

  constructor(
    uint256 openingTime_,
    uint256 closingTime_
  ) public Timed(openingTime_, closingTime_) {
    electionAuthority = msg.sender;
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
}
