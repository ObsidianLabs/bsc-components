export default {
  title: 'Gas',
  list: [
    {
      name: 'gasLimit',
      className: 'col-6',
      label: 'Gas Limit',
      icon: 'fas fa-burn',
      placeholder: 'Default: 1,000,000',
      default: 1000000
    },
    {
      name: 'gasPrice',
      className: 'col-6',
      label: 'Gas Price',
      icon: 'fas fa-dollar-sign',
      placeholder: 'Default: 10 Gwei',
      default: 10000000000
    }
  ]
}
