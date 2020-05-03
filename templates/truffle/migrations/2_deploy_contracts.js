const MetaCoin = artifacts.require('MetaCoin')

module.exports = (deployer) => {
  deployer.deploy(MetaCoin)
}
