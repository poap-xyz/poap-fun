const { addReactRefresh } = require('customize-cra-react-refresh');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const { override, fixBabelImports, addExternalBabelPlugin, addWebpackPlugin } = require('customize-cra');

module.exports = override(
  addReactRefresh(),
  addExternalBabelPlugin('emotion'),
  addWebpackPlugin(new AntdDayjsWebpackPlugin()),
  fixBabelImports('import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' })
);
