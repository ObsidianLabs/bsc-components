import { ethers } from 'ethers'
import { IpcChannel } from '@obsidians/ipc'

export default class Client {
  constructor ({ url, explorer }) {
    this.provider = new ethers.providers.JsonRpcProvider({ url })
    this.explorer = new ExplorerProxy(explorer)
  }

  async getAccount (address) {
    const balance = await this.provider.getBalance(address)
    const code = await this.provider.getCode(address)
    const txCount = await this.provider.getTransactionCount(address)
    const codeHash = ethers.utils.keccak256(code)
    return { balance, txCount, codeHash }
  }

  async getTransactions (address, page, size) {
    const result = await this.explorer.getHistory(address, page, size)
    const json = JSON.parse(result)
    return {
      length: 0,
      list: json.result,
    }
  }
}


class ExplorerProxy {
  constructor (url) {
    this.url = url
  }

  async getHistory (address, page = 0, size = 10) {
    const ipc = new IpcChannel()
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
    return await ipc.invoke('fetch', this.url, query)
  }
}
