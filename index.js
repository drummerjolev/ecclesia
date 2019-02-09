import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';
import { default as EcclesiaLib } from './lib/ecclesia';

const Registration  = contract(require('./build/contracts/Registration.json'));

export default function (host, port) {
  const provider = new Web3.providers.HttpProvider(`http:\/\/${host}:${port}`);
  return new EcclesiaLib(
    provider,
    Registration,
  );
}
