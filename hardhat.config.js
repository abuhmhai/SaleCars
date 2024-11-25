require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: "https://eth-sepolia.g.alchemy.com/v2/VgpHWZPmUWrqyaLppVmIjeeXy6F1FKxz", // Replace with your Alchemy/Infura API URL
      accounts: ["0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e"], // Replace with your private key
    },
  },
  etherscan: {
    apiKey: "UKUGFEC65XSAMSJGGK9SWDQANSMU97R1I3", // Replace with your Etherscan API key
  },
};
