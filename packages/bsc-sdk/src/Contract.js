import { ethers } from 'ethers'

export default class Contract {
  constructor ({ address, abi }, provider) {
    this.address = address
    this.abi = abi
    this.provider = provider
    this.instance = new ethers.Contract(address, abi, provider)
  }

  async query (method, { array }) {
    return await this.instance.functions[method](...array)
  }

  async execute (method, { array }, override) {
    const tx = await this.instance.populateTransaction[method](...array, override)
    const voidSigner = new ethers.VoidSigner(override.from, this.provider)
    return await voidSigner.populateTransaction(tx)
  }

  async getLogs (event) {
    const logs = await this.instance.queryFilter(event.name)
    return logs
  }
}