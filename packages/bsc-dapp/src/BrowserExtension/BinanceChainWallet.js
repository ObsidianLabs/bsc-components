import networks from '../networks'

export default class MetaMask {
  constructor (bcWallet) {
    this.name = 'Binance Chain Wallet'
    this._accounts = []
    this._enabled = false
    if (bcWallet && bcWallet.bnbSign) {
      this.bcWallet = bcWallet
      this._chainId = undefined
      this._chainId = undefined
      this._onEnabled = undefined
      this._currentAccount = undefined
    }
  }

  get isEnabled () { return this._enabled }

  async enable () {
    const accounts = await this.bcWallet.request({ method: 'eth_requestAccounts' })
    this._currentAccount = { address: accounts[0] }

    this._chainId = await this.bcWallet.request({ method: 'eth_chainId' })

    this.bcWallet.on('chainChanged', chainId => {
      this._chainId = chainId
      this._onNetworkChanged && this._onNetworkChanged(this.getNetwork())
    })
    this.bcWallet.on('accountsChanged', accounts => {
      this._currentAccount = { address: accounts[0] }
      this._onAccountChanged && this._onAccountChanged({ address: accounts[0] })
    })

    this._enabled = true
    this._onEnabled && this._onEnabled({ address: accounts[0] })
    return this._chainId
  }

  dispose () {
  }

  onEnabled (callback) {
    this._onEnabled = callback
    return () => this._onEnabled = undefined
  }

  get chainId () { return this._chainId }

  getNetwork (chainId = this.chainId) {
    return {
      chainId,
      isBscMainnet: chainId === '0x38',
      isBscTestnet: chainId === '0x61',
    }
  }

  onNetworkChanged (callback) {
    this._onNetworkChanged = callback
    return () => this._onNetworkChanged = undefined
  }

  get currentAccount () { return this._currentAccount }

  async getAllAccounts () {
    this._accounts = (await this.bcWallet.requestAccounts()).map(account => {
      account.address = account.addresses.find(item => item.type === 'eth').address
      return account
    })
    return this._accounts
  }

  onAccountChanged (callback) {
    this._onAccountChanged = callback
    return () => this._onAccountChanged = undefined
  }

  async signMessage (message) {
    return await this.bcWallet.request({ method: 'eth_sign', params: [this.currentAccount.address, message] })
  }

  async signTypedData (typedData) {
    throw new Error('signTypedData is not supported for Binance Chain Wallet.')
  }

  async sendTransaction (tx) {
    return await this.bcWallet.request({
      method: 'eth_sendTransaction',
      params: [tx],
    })
  }
}