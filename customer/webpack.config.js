const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

const TasksModuleFederationConfigPlugin = withModuleFederationPlugin({
  name: 'customer',

  exposes: {
    './Component': './src/app/app.component.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});

TasksModuleFederationConfigPlugin.output.publicPath = 'http://localhost:4202/'
module.exports = TasksModuleFederationConfigPlugin;