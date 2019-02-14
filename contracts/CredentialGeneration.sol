pragma solidity >=0.4.25 <0.6.0;

import {RSAAccumulator} from './RSAAccumulator.sol';
import {Timed} from './Timed.sol';

contract CredentialGeneration is Timed {
  RSAAccumulator public accumulatorContract;

  uint256[8] public accumulator;

  constructor(
    uint256 openingTime_,
    uint256 closingTime_,
    uint256[8] memory accumulator_,
    bytes memory accumulatorModulus_
  ) public Timed(openingTime_, closingTime_) {
    accumulatorContract = new RSAAccumulator(accumulatorModulus_);
    accumulator = accumulator_;
  }

  // add secret prime to accumulator
  // there is no limit to how many credential can be submitted by the same voter
  // at the reveal stage, only the first revealed vote will count
  function addToAccumulator(
    // TODO: we assume this is a valid prime, ideally generate prime in contract
    // credential must be <= 256 bits
    uint256 credential,
    bytes32 signedCredential,
    uint8 v,
    bytes32 r,
    bytes32 s
    ) public view returns (uint256[8] memory) {
      require(super.isOpen(), "Phase closed.");

      // retrieve the signer's Ethereum address, check if it is the voter
      address signerAddress = ecrecover(signedCredential, v, r, s);
      require(signerAddress == msg.sender, "Illegal signature.");

      // return updated accumulator
      return accumulatorContract.updateAccumulator(accumulator, credential);
    }

  // getter for accumulator
  function getAccumulator() public view returns (uint256[8] memory) {
    return accumulator;
  }

  // getter for accumulator modulus
  function getAccumulatorModulus() public view returns (uint256[8] memory) {
    // Provides the number used in the accumulator to check the computation
    // done in the contract.
    return accumulatorContract.getN();
  }
}
