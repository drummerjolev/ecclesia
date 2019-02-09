pragma solidity >=0.4.25 <0.6.0;

// Timed is meant to be inherited only and NOT used as-is
contract Timed {
  uint256 public openingTime;
  uint256 public closingTime;

  constructor (
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

    openingTime = openingTime_;
    closingTime = closingTime_;
  }

  function isOpen() public view returns (bool) {
    return block.timestamp >= openingTime && block.timestamp <= closingTime;
  }
}
