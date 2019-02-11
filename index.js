import { default as Web3 } from 'web3';
import Registration from './lib/registration';

const registrationJson = require('./build/contracts/Registration.json');

const RegistrationLib = (host, port, registrationAddress) => {
  const provider = new Web3.providers.HttpProvider(`http://${host}:${port}`);
  return new Registration(
    provider,
    registrationJson,
    registrationAddress,
  );
};

export default RegistrationLib;
