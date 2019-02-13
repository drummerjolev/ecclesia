pragma solidity >=0.4.25 <0.6.0;

// ORIGINAL CODE: https://github.com/matterinc/RSAAccumulator
// MODIFIED FORK: https://github.com/drummerjolev/RSAAccumulator

import {PrimeTester} from "./PrimeTester.sol";

contract RSAAccumulator {
    // all arithmetics is modulo N

    uint256 constant public NlengthIn32ByteLimbs = 8; // 1024 bits for factors, 2048 for modulus
    uint256 constant public NlengthInBytes = 32 * NlengthIn32ByteLimbs;
    uint256 constant public NLength = NlengthIn32ByteLimbs * 8 * 32;
    uint256 constant public g = 3;

    uint256[NlengthIn32ByteLimbs] public emptyAccumulator;
    uint256[NlengthIn32ByteLimbs] public accumulator; // try to store as static array for now; In BE
    uint256[NlengthIn32ByteLimbs] public N;

    PrimeTester public primeTester;
    event AccumulatorUpdated(uint256 indexed _coinID);

    constructor(bytes memory modulus) public {
        require(modulus.length == NlengthInBytes, "Modulus should be at least padded");
        uint256 limb = 0;
        uint256 dataLength = 0x20; // skip length;
        for (uint256 i = 0; i < NlengthIn32ByteLimbs; i++) {
            assembly {
                limb := mload(add(modulus, dataLength))
            }
            N[i] = limb;
            dataLength += 0x20;
        }
        primeTester = new PrimeTester();
    }

    function updateAccumulator(
        uint256[NlengthIn32ByteLimbs] memory previousAccumulator,
        uint256 _value)
    public view returns (uint256[NlengthIn32ByteLimbs] memory newAccumulator) {
        newAccumulator = modularExp(previousAccumulator, _value, N);
    }

    function updateAccumulatorMultiple(
        uint256[NlengthIn32ByteLimbs] memory previousAccumulator,
        uint256[] memory _limbs)
    public view returns (uint256[NlengthIn32ByteLimbs] memory newAccumulator) {
        newAccumulator = modularExpVariableLength(previousAccumulator, _limbs, N);
    }

    function getN()
    public
    view
    returns (uint256[NlengthIn32ByteLimbs] memory n) {
        return N;
    }

    // check that (g^w)^x = A
    // assume that all primes are valid, etc
    function checkInclusionProof(
        uint64 prime,
        uint256[] memory witnessLimbs,
        uint256[NlengthIn32ByteLimbs] memory initialAccumulator,
        uint256[NlengthIn32ByteLimbs] memory finalAccumulator
    )
    public
    view
    returns (bool isValue) {
        uint256[NlengthIn32ByteLimbs] memory nReadOnce = N;
        uint256[NlengthIn32ByteLimbs] memory lhs = modularExpVariableLength(initialAccumulator, witnessLimbs, nReadOnce);
        lhs = modularExp(lhs, uint256(prime), nReadOnce);
        if (compare(lhs, finalAccumulator) != 0) {
            return false;
        }
        return true;
    }

    // check that A*(g^r) = g^(x1*x2*...*xn)^cofactor
    // assume that all primes are valid, etc
    function checkNonInclusionProof(
        uint64[] memory primes,
        uint256[] memory rLimbs,
        uint256[] memory cofactorLimbs,
        uint256[NlengthIn32ByteLimbs] memory initialAccumulator,
        uint256[NlengthIn32ByteLimbs] memory finalAccumulator
    )
    public
    view
    returns (bool isValue) {
        require(primes.length >= 1, "Primes list must not be empty");
        uint256[NlengthIn32ByteLimbs] memory nReadOnce = N;
        uint256[NlengthIn32ByteLimbs] memory lhs = modularExpVariableLength(initialAccumulator, rLimbs, nReadOnce);
        lhs = modularMul4(lhs, finalAccumulator, nReadOnce);
        // extra factor of 4 on the LHS
        uint256 i = 0;
        uint256 primesLength = primes.length;
        uint256 multiplicationResult = 1;
        uint256[NlengthIn32ByteLimbs] memory rhs = modularExpVariableLength(initialAccumulator, cofactorLimbs, nReadOnce);
        uint256 numBatches = (primesLength / 4);
        for (i = 1; i <= primesLength % 4; i++) {
            multiplicationResult = multiplicationResult * uint256(primes[primesLength - i]);
        }
        rhs = modularExp(rhs, multiplicationResult, nReadOnce);
        for (i = 0; i < numBatches; i++) {
            multiplicationResult = uint256(primes[4*i]) * uint256(primes[4*i + 1]) + uint256(primes[4*i + 2]) + uint256(primes[4*i + 3]);
            rhs = modularExp(rhs, multiplicationResult, nReadOnce);
        }
        rhs = modularMulBy4(rhs, nReadOnce);
        // extra factor of 4 on LHS is compensated
        if (compare(lhs, rhs) != 0) {
            return false;
        }
        return true;
    }

    function modularMul4(
        uint256[NlengthIn32ByteLimbs] memory _a,
        uint256[NlengthIn32ByteLimbs] memory _b,
        uint256[NlengthIn32ByteLimbs] memory _m)
    public
    view
    returns (uint256[NlengthIn32ByteLimbs] memory c) {
        uint256[NlengthIn32ByteLimbs] memory aPlusB = modularExp(modularAdd(_a, _b, _m), 2, _m);
        uint256[NlengthIn32ByteLimbs] memory aMinusB = modularExp(modularSub(_a, _b, _m), 2, _m);
        uint256[NlengthIn32ByteLimbs] memory t = modularSub(aPlusB, aMinusB, _m);
        return t;
    }

    // cheat and just do two additions
    function modularMulBy4(
        uint256[NlengthIn32ByteLimbs] memory _a,
        uint256[NlengthIn32ByteLimbs] memory _m)
    public
    pure
    returns (uint256[NlengthIn32ByteLimbs] memory c) {
        uint256[NlengthIn32ByteLimbs] memory t = modularAdd(_a, _a, _m);
        c = modularAdd(t, t, _m);
    }

    function compare(
        uint256[NlengthIn32ByteLimbs] memory _a,
        uint256[NlengthIn32ByteLimbs] memory _b)
    public
    pure
    returns (int256 result) {
        for (uint256 i = 0; i < NlengthIn32ByteLimbs; i++) {
            if (_a[i] > _b[i]) {
                return 1;
            } else if (_a[i] < _b[i]) {
                return -1;
            }
        }
        return 0;
    }

    function wrappingSub(
        uint256[NlengthIn32ByteLimbs] memory _a,
        uint256[NlengthIn32ByteLimbs] memory _b
    )
    public
    pure
    returns (uint256[NlengthIn32ByteLimbs] memory o) {
        bool borrow = false;
        uint256 limb = 0;
        for (uint256 i = NlengthIn32ByteLimbs - 1; i < NlengthIn32ByteLimbs; i--) {
            limb = _a[i];
            if (borrow) {
                if (limb == 0) {
                    borrow = true;
                    limb--;
                    o[i] = limb - _b[i];
                } else {
                    limb--;
                    if (limb >= _b[i]) {
                        borrow = false;
                    }
                    o[i] = limb - _b[i];
                }
            } else {
                if (limb < _b[i]) {
                    borrow = true;
                }
                o[i] = limb - _b[i];
            }
        }
        return o;
    }

    function wrappingAdd(
        uint256[NlengthIn32ByteLimbs] memory _a,
        uint256[NlengthIn32ByteLimbs] memory _b
    )
    public
    pure
    returns (uint256[NlengthIn32ByteLimbs] memory o) {
        bool carry = false;
        uint256 limb = 0;
        uint256 subaddition = 0;
        for (uint256 i = NlengthIn32ByteLimbs - 1; i < NlengthIn32ByteLimbs; i--) {
            limb = _a[i];
            if (carry) {
                if (limb == uint256(~0)) {
                    carry = true;
                    o[i] = _b[i];
                } else {
                    limb++;
                    subaddition = limb + _b[i];
                    if (subaddition >= limb) {
                        carry = false;
                    }
                    o[i] = subaddition;
                }
            } else {
                subaddition = limb + _b[i];
                if (subaddition < limb) {
                    carry = true;
                }
                o[i] = subaddition;
            }
        }
        return o;
    }

    function modularSub(
        uint256[NlengthIn32ByteLimbs] memory _a,
        uint256[NlengthIn32ByteLimbs] memory _b,
        uint256[NlengthIn32ByteLimbs] memory _m)
    public
    pure
    returns (uint256[NlengthIn32ByteLimbs] memory o) {
        int256 comparison = compare(_a, _b);
        if (comparison == 0) {
            return o;
        } else if (comparison == 1) {
            return wrappingSub(_a, _b);
        } else {
            uint256[NlengthIn32ByteLimbs] memory tmp = wrappingSub(_b, _a);
            return wrappingSub(_m, tmp);
        }
    }

    function modularAdd(
        uint256[NlengthIn32ByteLimbs] memory _a,
        uint256[NlengthIn32ByteLimbs] memory _b,
        uint256[NlengthIn32ByteLimbs] memory _m)
    public
    pure
    returns (uint256[NlengthIn32ByteLimbs] memory o) {
        uint256[NlengthIn32ByteLimbs] memory space = wrappingSub(_m, _a);
        // see how much "space" has left before an overflow
        int256 comparison = compare(space, _b);
        if (comparison == 0) {
            return o;
        } else if (comparison == 1) {
            return wrappingAdd(_a, _b);
        } else {
            return wrappingSub(_b, space);
        }
    }

    // this assumes that exponent in never larger than 256 bits
    function modularExp(
        uint256[NlengthIn32ByteLimbs] memory base,
        uint256 e,
        uint256[NlengthIn32ByteLimbs] memory m)
    public view returns (uint256[NlengthIn32ByteLimbs] memory output) {
        uint256 modulusLength = NlengthInBytes;
        uint256 memoryPointer = 0;
        uint256 dataLength = 0;
        assembly {
            // define pointer
            memoryPointer := mload(0x40)
            // store data assembly-favouring ways
            mstore(memoryPointer, modulusLength)    // Length of Base
            mstore(add(memoryPointer, 0x20), 0x20)  // Length of Exponent
            mstore(add(memoryPointer, 0x40), modulusLength)  // Length of Modulus
        }
        dataLength = 0x60;
        // now properly pack bases, etc
        uint256 limb = 0;
        for (uint256 i = 0; i < NlengthIn32ByteLimbs; i++) {
            limb = base[i];
            assembly {
                mstore(add(memoryPointer, dataLength), limb)  // cycle over base
            }
            dataLength += 0x20;
        }

        assembly {
            mstore(add(memoryPointer, dataLength), e)     // Put exponent
        }
        dataLength += 0x20;

        for (uint256 i = 0; i < NlengthIn32ByteLimbs; i++) {
            limb = m[i];
            assembly {
                mstore(add(memoryPointer, dataLength), limb)  // cycle over base
            }
            dataLength += 0x20;
        }
        // do the call
        assembly {
            let success := staticcall(sub(gas, 2000), 0x05, memoryPointer, dataLength, memoryPointer, modulusLength) // here we overwrite!
            // gas fiddling
            switch success case 0 {
                revert(0, 0)
            }
        }
        dataLength = 0;
        limb = 0;
        for (uint256 i = 0; i < NlengthIn32ByteLimbs; i++) {
            assembly {
                limb := mload(add(memoryPointer, dataLength))
            }
            dataLength += 0x20;
            output[i] = limb;
        }
        return output;
    }

    // this assumes that exponent in never larger than 256 bits
    function modularExpVariableLength(
        uint256[NlengthIn32ByteLimbs] memory base,
        uint256[] memory e,
        uint256[NlengthIn32ByteLimbs] memory m)
    public view returns (uint256[NlengthIn32ByteLimbs] memory output) {
        uint256 modulusLength = NlengthInBytes;
        uint256 memoryPointer = 0;
        uint256 dataLength = 0;
        uint256 exponentLimbs = e.length;
        assembly {
            // define pointer
            memoryPointer := mload(0x40)
            // store data assembly-favouring ways
            mstore(memoryPointer, modulusLength)    // Length of Base
            mstore(add(memoryPointer, 0x20), mul(exponentLimbs, 0x20))  // Length of Exponent
            mstore(add(memoryPointer, 0x40), modulusLength)  // Length of Modulus
        }
        dataLength = 0x60;
        // now properly pack bases, etc
        uint256 limb = 0;
        for (uint256 i = 0; i < NlengthIn32ByteLimbs; i++) {
            limb = base[i];
            assembly {
                mstore(add(memoryPointer, dataLength), limb)  // cycle over base
            }
            dataLength += 0x20;
        }

        for (uint256 i = 0; i < exponentLimbs; i++) {
            limb = e[i];
            assembly {
                mstore(add(memoryPointer, dataLength), limb)  // cycle over exponent
            }
            dataLength += 0x20;
        }

        for (uint256 i = 0; i < NlengthIn32ByteLimbs; i++) {
            limb = m[i];
            assembly {
                mstore(add(memoryPointer, dataLength), limb)  // cycle over base
            }
            dataLength += 0x20;
        }
        // do the call
        assembly {
            let success := staticcall(sub(gas, 2000), 0x05, memoryPointer, dataLength, memoryPointer, modulusLength) // here we overwrite!
            // gas fiddling
            switch success case 0 {
                revert(0, 0)
            }
        }
        dataLength = 0;
        limb = 0;
        for (uint256 i = 0; i < NlengthIn32ByteLimbs; i++) {
            assembly {
                limb := mload(add(memoryPointer, dataLength))
            }
            dataLength += 0x20;
            output[i] = limb;
        }
        return output;
    }

}
