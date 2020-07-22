require('dotenv').config()
const { getEnvVariable } = require("../utils/");

async function main() {
  // Deploy variables
  const network = getEnvVariable('NETWORK');
  const privateKey = getEnvVariable('PK_DEPLOYER');

  let provider = network === 'localhost' ? new ethers.providers.JsonRpcProvider('http://localhost:9545') : new ethers.getDefaultProvider(network);
  const deployer = new ethers.Wallet(privateKey, provider);

  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const RaffleVerifier = await ethers.getContractFactory("RaffleSignatureVerifier", deployer);
  const contract = await RaffleVerifier.deploy();
  await contract.deployed();

  console.log("Contract address:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
