pragma solidity >=0.4.25 <0.6.0;

import {RSAAccumulator} from './RSAAccumulator.sol';

contract CredentialGeneration {
  // TODO: move to library
  // stores IPFS hashes
  // see: https://bit.ly/2SbuouC
  struct Multihash {
    bytes32 digest;
    uint8 hashFunction;
    uint8 size;
  }

  RSAAccumulator public rsaAccumulator;

  // TODO: using Oraclize, retrieve Ver. func for Voter
  // TODO: check signature
  
  constructor(
    uint256 openingTime_,
    uint256 closingTime_,
    bytes memory accumulatorModulus_
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

    rsaAccumulator = new RSAAccumulator(accumulatorModulus_);
  }

  // add secret prime to accumulator
  /* function addToAccumulator() {
  ...
  } */

  // getter for accumulator modulus
  function getAccumulatorModulus() public view returns (uint256[8]) {
    // Different from provided bytes argument in constructor
    // Provides the number used in the accumulator to check the computation
    // done in the contract.
    return rsaAccumulator.getN();
  }
}
