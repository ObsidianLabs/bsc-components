import networks from './networks'
import BinanceChainWallet from './BrowserExtension/BinanceChainWallet'
import MetaMask from './BrowserExtension/MetaMask'
import Client from './Client'

export default class BscDapp {
  constructor ({
    extension,
  } = {}) {
    this._client = null

    if (!extension) {
      this.initBinanceChainWallet() || this.initMetaMask()
    } else if (extension === 'BinanceChainWallet') {
      this.initBinanceChainWallet()
    } else if (extension === 'MetaMask') {
      this.initMetaMask()
    }

    if (!this._browserExtension) {
      console.warn('Unable to init the dApp. No compatible browser extension is found.')
    }
  }

  initBinanceChainWallet () {
    if (window.BinanceChain && window.BinanceChain.bnbSign) {
      this._browserExtension = new BinanceChainWallet(window.BinanceChain)
      return this._browserExtension
    }
  }

  initMetaMask () {
    if (window.ethereum && window.ethereum.isMetaMask) {
      this._browserExtension = new MetaMask(window.ethereum)
      return this._browserExtension
    }
  }

  get browserExtension () { return this._browserExtension }

  get isBrowserExtensionInstalled () {
    return Boolean(this.browserExtension)
  }

  get isBrowserExtensionEnabled () {
    return this.isBrowserExtensionInstalled && this.browserExtension.isEnabled
  }

  async enableBrowserExtension () {
    const chainId = this.isBrowserExtensionInstalled && await this.browserExtension.enable()
    this.initRpcFromChainId(chainId)
    return chainId
  }

  onEnabled (callback) {
    return this.isBrowserExtensionInstalled && this.browserExtension.onEnabled(callback)
  }

  get network () {
    return this.isBrowserExtensionInstalled && this.browserExtension.getNetwork()
  }

  onNetworkChanged (callback) {
    const handler = network => {
      this.initRpcFromChainId(network.chainId)
      callback(network)
    }
    return this.isBrowserExtensionInstalled && this.browserExtension.onNetworkChanged(handler)
  }

  initRpcFromChainId (chainId) {
    if (chainId) {
      const network = networks.find(n => n.chainId === chainId)
      if (network) {
        this._client = new Client(network)
      }
    }
  }

  get rpc () { return this._client && this._client.provider }
  get explorer () { return this._client && this._client.explorer }

  get currentAccount () {
    return this.isBrowserExtensionInstalled && this.browserExtension.currentAccount
  }

  onAccountChanged (callback) {
    return this.isBrowserExtensionInstalled && this.browserExtension.onAccountChanged(callback)
  }

  async getAllAccounts () {
    return this.isBrowserExtensionInstalled && await this.browserExtension.getAllAccounts()
  }

  async signMessage (message) {
    return this.isBrowserExtensionInstalled && await this.browserExtension.signMessage(message)
  }

  async signTypedData (typedData) {
    return this.isBrowserExtensionInstalled && await this.browserExtension.signTypedData(typedData)
  }

  async sendTransaction ({ from, to, value, ...others }) {
    return this.isBrowserExtensionInstalled && await this.browserExtension.sendTransaction({
      from,
      to,
      value: value.toHexString(),
      ...others,
    })
  }

  async executeContract ({ address, abi }, method, parameters = [], overrides = {}) {
    return this._client.executeContract({ address, abi }, method, parameters, overrides)
  }

  parseEther (ether) {
    return this._client.parseEther(ether)
  }
}