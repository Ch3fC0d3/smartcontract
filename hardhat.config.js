require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Define network configuration based on environment variables
const networks = {
  hardhat: {
    // Local development network
  }
};

// Only add Sepolia network if a valid URL and private key are provided
if (process.env.SEPOLIA_URL && process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length >= 64) {
  networks.sepolia = {
    url: process.env.SEPOLIA_URL,
    accounts: [process.env.PRIVATE_KEY],
  };
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks,
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};
