pragma solidity >=0.4.25 <0.6.0;

contract Registration {
  uint256 public openingTime;
  uint256 public closingTime;

  // TODO: add rest of the parameters G, p, n
  // TODO: Make struct for EC?
  // TODO: add getters, see example for ellipticCurve below
  string public ellipticCurve;
  string public hashFunction;

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

    // EA will have a public Ethereum address.
    // The caveat is that we have to expect voters to trust that address.
    // This risk is ongoing throughout the election - the address could get
    // compromised at any time.
    openingTime = openingTime_;
    closingTime = closingTime_;

    // We assume we always use the Schnorr Signature scheme. RSA?
    // The EA deploys the elliptic curve, G, p, n. Picks a hash function.
    // Use NIST specifications.
    ellipticCurve = ellipticCurve_;
    hashFunction = hashFunction_;
  }

  // implements the opening and closing of the time frame
  // determines whether or not the contract is valid when invoked
  function isOpen() public view returns (bool) {
    return block.timestamp >= openingTime && block.timestamp <= closingTime;
  }

  function getEllipticCurve() public view returns (string memory) {
    return ellipticCurve;
  }
}
