import { ethers } from 'ethers'
import { utils } from '@obsidians/eth-sdk'
import txOptions from "./txOptions"

const display = value => {
  const amount = ethers.utils.formatEther(value)
  if (amount > 0.001) {
    return `${new Intl.NumberFormat().format(amount)} BNB`
  } else if (amount > 0.0000000001) {
    const gvalue = ethers.utils.formatUnits(value, 'gwei')
    return `${new Intl.NumberFormat().format(gvalue)} Gwei`
  } else {
    return `${new Intl.NumberFormat().format(value)} wei`
  }
}

export default {
  ...utils,
  txOptions,
  display,
}