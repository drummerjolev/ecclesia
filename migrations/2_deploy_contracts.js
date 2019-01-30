const Ecclesia = artifacts.require("./Ecclesia.sol");
const Registration = artifacts.require("./Registration.sol");

module.exports = function(deployer) {
	deployer.deploy(Ecclesia);
	deployer.deploy(Registration);
};
