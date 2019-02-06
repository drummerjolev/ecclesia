pragma solidity >=0.4.25 <0.6.0;

import {RSAAccumulator} from './RSAAccumulator.sol';

contract CredentialGeneration {
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
  require(block.timestamp >= openingTime && block.timestamp <= closingTime)
  ...
  what should happen here? return accumulator or save it to a list in contract?
  // IPFS: https://docs.oraclize.it/#ethereum-quick-start-simple-query
  } */

  // getter for accumulator
  function getAccumulator() public view returns (uint256) {
    // TODO: return array
    return 3;
  }

  // getter for accumulator modulus
  function getAccumulatorModulus() public view returns (uint256[8] memory) {
    // TODO: Different from provided bytes argument in constructor (8)
    // Provides the number used in the accumulator to check the computation
    // done in the contract.
    return rsaAccumulator.getN();
  }
}
