const Ecclesia = artifacts.require("./Ecclesia.sol");
const Registration = artifacts.require("./Registration.sol");
const CredentialGeneration = artifacts.require("./CredentialGeneration.sol");

// Deployment Arguments
const RegistrationArgs = [
	1568851200,
	1569110400,
	"secp256k1",
	"SHA1"
];

const CredentialGenerationArgs = [
	1568851400,
	1570110400,
	// 2048 bit modulus hex
	"0xb2f5fd3f9f0917112ce42f8bf87ed676e15258be443f36deafb0b69bde2496b495eaad1b01cad84271b014e96f79386c636d348516da74a68a8c70fba882870c47b4218d8f49186ddf72727b9d80c21911c3e337c6e407ffb47c2f2767b0d164d8a1e9af95f6481bf8d9edfb2e3904b2529268c460256fafd0a677d29898f10b1d15128a695839fc08edd584e8335615b1d1d7277be65c532dca92ddc7050374868b117ea9154914ef9292b8443f13696e4fad50ded6bd90e5a6f7ed33be2ece31c6dd7a4253ee6cdc56787ddd1d5cd776614022db87d03bb22f23285b5a3167af8dacabbea40004471337d3781e8c5cca0ea5e27799b510e4ef938c61caa60d",
];

module.exports = (deployer, network, accounts) => {
	deployer.deploy(Ecclesia);
	deployer.deploy(Registration, ...RegistrationArgs);
	deployer.deploy(CredentialGeneration, ...CredentialGenerationArgs);
};
