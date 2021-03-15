import { ethers } from 'ethers'
import qs from 'qs'

export default class Client {
  constructor ({ url, explorer }) {
    this.provider = new ethers.providers.JsonRpcProvider({ url })
    this.explorer = new Explorer(explorer)
  }

  async getAccount (address) {
    const balance = await this.provider.getBalance(address)
    const code = await this.provider.getCode(address)
    const codeHash = ethers.utils.keccak256(code)
    return { balance, codeHash }
  }

  async executeContract ({ address, abi }, method, parameters = [], overrides = {}) {
    const contract = new ethers.Contract(address, abi, this.provider)
    const tx = await contract.populateTransaction[method](...parameters, overrides)
    return tx
  }

  async getTransactions (address, page, size) {
    const result = await this.explorer.getHistory(address, page, size)
    return {
      length: 0,
      list: result.result,
    }
  }

  parseEther (ether) {
    return ethers.utils.parseEther(ether)
  }
}


class Explorer {
  constructor (url) {
    this.url = url
  }

  async getHistory (address, page = 0, size = 10) {
    const query = {
      module: 'account',
      action: 'txlist',
      address,
      startblock: 0,
      endblock: 99999999,
      page: page + 1,
      offset: size,
      sort: 'desc'
    }

    const res = await fetch(`${this.url}?${qs.stringify(query)}`)
    const result = await res.json()
    return result
  }
}
