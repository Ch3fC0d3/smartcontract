// Scripts for deploying the MyToken contract
const { ethers } = require("hardhat");

/**
 * Deploys the MyToken contract with the initial supply from environment variables
 */
async function main() {
  // Get deployment parameters from environment variables
  const initialSupply = process.env.INITIAL_SUPPLY || "1000000";
  
  console.log(`Deploying MyToken with initial supply: ${initialSupply}`);

  // Get the contract factory
  const MyToken = await ethers.getContractFactory("MyToken");
  
  // Deploy the contract
  const myToken = await MyToken.deploy(initialSupply);
  await myToken.waitForDeployment();

  // Get the contract address
  const address = await myToken.getAddress();
  console.log(`MyToken deployed to: ${address}`);
  
  // Log deployment information
  console.log("Deployment complete. Contract details:");
  console.log("-----------------------------------");
  console.log(`Address: ${address}`);
  console.log(`Initial Supply: ${initialSupply}`);
  console.log("-----------------------------------");
  
  // Return the contract for testing purposes
  return myToken;
}

// Execute the deployment function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
