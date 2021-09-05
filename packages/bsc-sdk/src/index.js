import {
  makeSdk,
  kp,
  EthersClient,
  EthersContract,
  EthTxManager,
  rpc,
} from '@obsidians/eth-sdk'

import networks from './networks'

// import BrowserExtension from './BrowserExtension'

import utils from './utils'

export default makeSdk({
  kp,
  networks,
  Client: EthersClient,
  Contract: EthersContract,
  TxManager: EthTxManager,
  BrowserExtension: undefined,
  utils,
  rpc,
})
