import { default as Web3 } from 'web3';
// TODO: do we need this? or web3 from here on?
// import { default as contract } from 'truffle-contract';
import { default as EcclesiaLib } from './lib/ecclesia';

// for web3 only, remove contract(...)
const contractJson = require('./build/contracts/Registration.json');

export default function (host, port, registrationAddress) {
  const provider = new Web3.providers.HttpProvider(`http://${host}:${port}`);
  return new EcclesiaLib(
    provider,
    contractJson,
    registrationAddress,
  );
}
