pragma solidity >=0.4.25 <0.6.0;

library IPFS {
  struct Multihash {
    bytes32 digest;
    uint8 hashFunction;
    uint8 size;
  }
}
