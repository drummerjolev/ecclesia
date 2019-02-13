import BN from 'bn.js';

export const bnToString = bn => bn.toString(10, 1000).replace(/^0+/, '');

export const accumulatorToBn = (accumulator, numLimbs) => {
  const newBN = (new BN(accumulator[0].toString(16), 16));
  for (let i = 1; i < numLimbs; i += 1) {
    newBN.iushln(256);
    const limb = (new BN(accumulator[i].toString(16), 16));
    newBN.iadd(limb);
  }
  return newBN;
};

export const bnToAccumulator = (bn, numLimbs) => {
  const newBN = bn.clone();
  const reversedAccumulator = [];
  const modulus = (new BN(1).iushln(256));
  let limb = newBN.umod(modulus);
  reversedAccumulator.push(limb);
  for (let i = 1; i < numLimbs; i += 1) {
    newBN.iushrn(256);
    limb = newBN.umod(modulus);
    reversedAccumulator.push(limb);
  }
  return reversedAccumulator.reverse();
};
