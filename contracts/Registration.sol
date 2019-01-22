pragma solidity >=0.4.25 <0.6.0;

contract Registration {
  uint256 public contractOpeningTime;
  uint256 public contractClosingTime;

  // TODO: add rest of the parameters G, p, n. Make struct for EC?
  // TODO: add getters, see example for ellipticCurve below
  string public ellipticCurve;
  string public hashFunction;

  constructor (
    uint256 openingTime,
    uint256 closingTime,
    string memory eCurve,
    string memory hFunction
  ) public {
    // The require function should be used to ensure valid conditions,
    // such as inputs, or contract state variables are met,
    // or to validate return values from calls to external contracts
    require(
      openingTime >= block.timestamp,
      "Opening Time must be in the future."
    );
    require(
      closingTime > openingTime,
      "Closing Time must be after Opening Time."
    );

    // Is there a need to limit who can deploy the contract?
    // EA will have a public Ethereum address.
    // We have to expect voters to trust that address.

    contractOpeningTime = openingTime;
    contractClosingTime = closingTime;

    // TODO: set signature scheme.
    // We assume we always use the Schnorr Signature scheme. RSA?
    // The EA deploys the elliptic curve, G, p, n. Picks a hash function.
    // Use NIST specifications.
    ellipticCurve = eCurve;
    hashFunction = hFunction;
  }

  function isOpen() public view returns (bool) {
    return block.timestamp >= contractOpeningTime && block.timestamp <= contractClosingTime;
  }

  function getEllipticCurve() public view returns (string memory) {
    return ellipticCurve;
  }
}
