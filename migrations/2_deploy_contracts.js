const Ecclesia = artifacts.require("./Ecclesia.sol");

module.exports = function(deployer) {
	deployer.deploy(Ecclesia);
};
