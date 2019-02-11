import { default as Web3 } from 'web3';
import { default as EcclesiaLib } from './lib/ecclesia';

const contractJson = require('./build/contracts/Registration.json');

export default async function (host, port, registrationAddress) {
  const provider = new Web3.providers.HttpProvider(`http://${host}:${port}`);
  return await new EcclesiaLib(
    provider,
    contractJson,
    registrationAddress,
  );
}
