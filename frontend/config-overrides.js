const { addReactRefresh } = require('customize-cra-react-refresh');
const { override, fixBabelImports, addExternalBabelPlugin } = require('customize-cra');

module.exports = override(
  addReactRefresh(),
  addExternalBabelPlugin('emotion'),
  fixBabelImports('import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }),
);
