require('babel-register');
require('babel-polyfill');
require('dotenv').config();

module.exports = {
  
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8794,
      network_id: "*"//match any network id
    },
  },

  contracts_directory: './src/contracts',
  contracts_build_directory: './src/abis',
  
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  
};
