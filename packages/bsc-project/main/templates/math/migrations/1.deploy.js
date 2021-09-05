const BEP20Token = artifacts.require('BEP20Token')

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(BEP20Token)
}
