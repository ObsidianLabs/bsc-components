import { ethers } from 'ethers'

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
  sign: {
    sha3: ethers.utils.keccak256
  },
  format: {
    bytes: str => ethers.utils.toUtf8Bytes(str),
    bytesFromHex: hex => ethers.utils.arrayify(hex),
  },
  unit: {
    fromValue: ethers.utils.formatEther,
    toValue: ethers.utils.parseEther,
    valueToGvalue: v => ethers.utils.formatUnits(v, 'gwei')
  },
  display,
  decodeError: () => '',
}