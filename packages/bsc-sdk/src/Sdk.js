import { ethers } from 'ethers'

import networks from './networks'
import kp from './kp'
import utils from './utils'
import txOptions from './txOptions'
import Client from './Client'
import rpc from './rpc'
import Contract from './Contract'
import signatureProvider from './signatureProvider'
// import BrowserExtension from './BrowserExtension'

// let browserExtension

export default class Sdk {
  constructor ({ url, chainId, explorer, id }) {
    this.client = new Client({ url, explorer })
    this.networkId = id
    this.url = url
    this.chainId = chainId
    this.explorer = explorer
  }

  static get kp () { return kp }
  static get networks () { return networks }

  // static InitBrowserExtension (networkManager) {
  //   if (window.ethereum && window.ethereum.isMetaMask) {
  //     browserExtension = new BrowserExtension(networkManager, window.ethereum)
  //     return browserExtension
  //   }
  // }

  get utils () { return utils }
  get txOptions () { return txOptions }
  get rpc () { return rpc }
  get namedContracts () { return {} }

  get provider () {
    return this.client.provider
  }

  isValidAddress (address) {
    return ethers.utils.isAddress(address)
  }

  async callRpc (method, parameters) {
    const params = rpc.prepare(parameters)
    return await this.provider.send(method, params)
  }

  async networkInfo () {
    return await this.provider.getNetwork()
  }

  async getStatus () {
    return await this.provider.getBlock('latest')
  }

  async latest () {
    const status = await this.getStatus()
    return status.number
  }
  
  async accountFrom (address) {
    const account = await this.client.getAccount(address)
    return {
      address,
      balance: utils.unit.fromValue(account.balance),
      txCount: BigInt(account.txCount).toString(10),
      codeHash: account.codeHash === '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470' ? null : account.codeHash,
    }
  }

  contractFrom ({ address, abi }) {
    return new Contract({ address, abi }, this.provider)
  }

  async getTransferTransaction ({ from, to, amount }) {
    const value = utils.unit.toValue(amount)
    const voidSigner = new ethers.VoidSigner(from, this.provider)
    return await voidSigner.populateTransaction({ to, value })
  }

  async getDeployTransaction ({ abi, bytecode, parameters }, override) {
    const factory = new ethers.ContractFactory(abi, bytecode)
    const tx = await factory.getDeployTransaction(...parameters)
    const voidSigner = new ethers.VoidSigner(override.from, this.provider)
    return await voidSigner.populateTransaction(tx)
  }

  async estimate (tx) {
    const gasPrice = await this.callRpc('eth_gasPrice')
    const result = await this.provider.estimateGas(tx)
    return {
      gasLimit: result.toString(),
      gasPrice: BigInt(gasPrice).toString(10),
    }
  }

  sendTransaction (tx) {
    let pendingTx
    if (this.provider.isMetaMask && browserExtension && browserExtension.currentAccount === tx.from) {
      const signer = this.provider.getSigner(tx.from)
      pendingTx = signer.sendTransaction(tx)
    } else {
      const sp = signatureProvider(tx.from)
      pendingTx = sp(tx).then(signedTx => this.provider.sendTransaction(signedTx))
    }

    const promise = pendingTx.then(res => res.hash)

    promise.mined = async () => {
      const res = await pendingTx
      try {
        await res.wait(1)
      } catch (err) {
        const { reason, code, transaction: tx, receipt } = err
        tx.value = tx.value.toString()
        tx.gasPrice = tx.gasPrice.toString()
        tx.gasLimit = tx.gasLimit.toString()
        receipt.gasUsed = receipt.gasUsed.toString()
        receipt.cumulativeGasUsed = receipt.cumulativeGasUsed.toString()
        return { error: reason, code, tx, receipt }
      }
      const tx = await this.provider.getTransaction(res.hash)
      delete tx.confirmations
      tx.value = tx.value.toString()
      tx.gasPrice = tx.gasPrice.toString()
      tx.gasLimit = tx.gasLimit.toString()
      return tx
    }

    promise.executed = async () => {
      const res = await pendingTx
      const receipt = await this.provider.getTransactionReceipt(res.hash)
      delete receipt.confirmations
      receipt.gasUsed = receipt.gasUsed.toString()
      receipt.cumulativeGasUsed = receipt.cumulativeGasUsed.toString()
      return receipt
    }

    promise.confirmed = () => pendingTx.then(res => res.wait(10))

    return promise
  }

  async getTransactionsCount () {
    return
  }

  async getTransactions (address, page = 0, size = 10) {
    return await this.client.getTransactions(address, page, size)
  }

  async tokenInfo (address) {
    return
  }

  async getTokens (address) {
    return
  }
}
