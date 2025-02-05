const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

const CustomerModuleFederationConfigPlugin = withModuleFederationPlugin({

  name: 'customer',

  exposes: {
    './CustomerModule': './src/app/customer/customer.module.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});

CustomerModuleFederationConfigPlugin.output.publicPath = 'http://localhost:4202/'
module.exports = CustomerModuleFederationConfigPlugin;