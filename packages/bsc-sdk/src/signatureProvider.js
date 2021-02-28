import keypairManager from '@obsidians/keypair'
import { ethers } from 'ethers'

export default function signatureProvider (address) {
  return async tx => {
    const privateKey = await keypairManager.getSecret(address.toLowerCase())
    const wallet = new ethers.Wallet(privateKey)
    return await wallet.signTransaction(tx)
  }
}