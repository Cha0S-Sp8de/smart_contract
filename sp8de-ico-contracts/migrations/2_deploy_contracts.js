var ICO = artifacts.require("SpadeIco.sol");

const testMode = true;

module.exports = function(deployer, network, accounts) {
  return testMode
      ? testDeployment(deployer, network, accounts)
      : realDeployment(deployer, network, accounts)
};

function testDeployment(deployer, network, accounts){
  const team = accounts[0];
  const agent = accounts[0];
  const migrationMaster = accounts[0]; 

  deployer.deploy(ICO, team, agent, migrationMaster);
}

function realDeployment(deployer, network, accounts){
  const team =  accounts[0];
  const agent = accounts[0];
  const migrationMaster = accounts[0];

  deployer.deploy(ICO, team, agent, migrationMaster);
}