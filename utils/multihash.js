import bs58 from 'bs58';

export const getMultihashFromHash = (hash) => {
  const decoded = bs58.decode(hash);
  return {
    digest: `0x${decoded.slice(2).toString('hex')}`,
    hashFunction: decoded[0],
    size: decoded[1],
  };
};

export const getHashFromMultihash = (multihash) => {
  const { digest, hashFunction, size } = multihash;
  if (size === 0) return null;

  const hashBytes = Buffer.from(digest.slice(2), 'hex');
  const multihashBytes = new (hashBytes.constructor)(2 + hashBytes.length);
  multihashBytes[0] = hashFunction;
  multihashBytes[1] = size;
  multihashBytes.set(hashBytes, 2);

  return bs58.encode(multihashBytes);
};
