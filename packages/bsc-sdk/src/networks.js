import platform from '@obsidians/platform'

const networks = [
  {
    id: 'testnet',
    group: 'testnet',
    name: 'BSC Testnet',
    fullName: 'BSC Testnet',
    icon: 'fas fa-vial',
    notification: 'Switched to <b>BSC Testnet</b>.',
    url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    chainId: 0x61,
    explorer: 'https://api-testnet.bscscan.com/api',
  },
  {
    id: 'mainnet',
    group: 'mainnet',
    name: 'BSC Mainnet',
    fullName: 'BSC Mainnet',
    icon: 'fas fa-globe',
    notification: 'Switched to <b>BSC Mainnet</b>.',
    url: 'https://bsc-dataseed.binance.org',
    chainId: 0x38,
    explorer: 'https://api.bscscan.com/api',
  }
]

// if (platform.isDesktop) {
//   networks.unshift({
//     id: 'dev',
//     group: 'default',
//     name: 'Local',
//     fullName: 'Local Network',
//     icon: 'fas fa-laptop-code',
//     notification: 'Switched to <b>Local</b> network.',
//     url: 'http://127.0.0.1:8575',
//     chainId: 201030,
//   })
// }

export default networks
