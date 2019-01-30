const Ecclesia = artifacts.require("./Ecclesia.sol");
const Registration = artifacts.require("./Registration.sol");

// Deployment Arguments
const RegistrationArgs = [
	1568851200,
	1569110400,
	"secp256k1",
	"SHA1"
];

module.exports = (deployer, network, accounts) => {
	deployer.deploy(Ecclesia);
	deployer.deploy(Registration, ...RegistrationArgs);
};
