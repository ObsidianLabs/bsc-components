const { IpcChannel } = require('@obsidians/ipc')

class SdkChannel extends IpcChannel {
  constructor () {
    super('bsc-explorer')
  }

  async GET (url, query) {
    if (url.startsWith('dev')) {
      return { result: [] }
    }

    const result = await this.fetch(url, query)
    try {
      return JSON.parse(result)
    } catch {
      return { result: [] }
    }
  }
}

module.exports = SdkChannel