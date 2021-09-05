const { ethers } = require('ethers')
const BEP20Token = require('../build/contracts/BEP20Token.json')

const provider = ethers.getDefaultProvider('http://localhost:62743')
const signer = provider.getSigner()

async function main() {
  const factory = new ethers.ContractFactory(BEP20Token.abi, BEP20Token.bytecode, signer)
  const deployed = await factory.deploy()
  console.log('Contract deployed to:', deployed.address)
}

main()
