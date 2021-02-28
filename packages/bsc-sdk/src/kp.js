import { ethers } from 'ethers'
import { IpcChannel } from '@obsidians/ipc'

const channel = new IpcChannel('keypair')

export default {
  async newKeypair () {
    const secret = await channel.invoke('post', 'new-secret')
    const address = ethers.utils.computeAddress(secret)
    return {
      address: address.toLowerCase(),
      secret,
    }
  },
  importKeypair (secret) {
    const address = ethers.utils.computeAddress(secret)
    return {
      address: address.toLowerCase(),
      secret,
    }
  },
}