pragma solidity >=0.4.25 <0.6.0;

import {IPFS} from './IPFS.sol';

// The Opening phase allows voters to submit IPFS hashes to their revealed votes
// There is no tallying, as every party can verify the hashes and compute the tally
contract Opening {

  uint256 public openingTime;
  uint256 public closingTime;

  address public electionAuthority;

  mapping(address => IPFS.Multihash) votes;

  constructor(
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
  }

  // Ballot is committed
  // Voter submits revealed vote to IPFS, hash is stored here
  function reveal(
    bytes32 _digest,
    uint8 _hashFunction,
    uint8 _size
  ) public {
    require(block.timestamp >= openingTime && block.timestamp <= closingTime);

    // every address can only reveal one vote
    if (votes[msg.sender].size == 0) {
      votes[msg.sender] = IPFS.Multihash(_digest, _hashFunction, _size);
    }
  }

  // Time-locked ballots are revealed by the Election Authority
  // Only IPFS hashes are stored, can be verified by all parties
  function revealTimeLocked(
    bytes32 _digest,
    uint8 _hashFunction,
    uint8 _size,
    address _dishonestVoter
  ) public {
    // no requirement to be within the time frame
    // Time Lock implies the Election Authority needs some time to
    // forcibly open the ballots after the Opening phase closes
    require(msg.sender == electionAuthority);

    if (votes[_dishonestVoter].size == 0) {
      votes[_dishonestVoter] = IPFS.Multihash(_digest, _hashFunction, _size);
    }
  }
}
