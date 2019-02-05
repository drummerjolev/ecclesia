pragma solidity >=0.4.25 <0.6.0;

contract CredentialGeneration {
  // TODO: move to library
  // stores IPFS hashes
  // see: https://bit.ly/2SbuouC
  struct Multihash {
    bytes32 digest;
    uint8 hashFunction;
    uint8 size;
  }

  // TODO: EA provides modulus, initial accumulator
  // TODO: using Oraclize, retrieve Ver. func for Voter
  // TODO: check signature
  // TODO: update accumulator

  constructor(
    uint256 openingTime_,
    uint256 closingTime_
  ) public {
    // TODO: DRY, move this to abstract?
    // TODO: link with other contract? i.e. require previous phase to close
    require(
      openingTime_ >= block.timestamp,
      "Opening Time must be in the future."
    );
    require(
      closingTime_ > openingTime_,
      "Closing Time must be after Opening Time."
    );


  }
}
