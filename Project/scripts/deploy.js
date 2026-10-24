const { ethers } = require("hardhat");

async function main() {
  const Voting = await ethers.getContractFactory("UniversityVoting");
  const voting = await Voting.deploy();
  await voting.waitForDeployment();

  console.log("UniversityVoting deployed to:", await voting.getAddress());
  console.log("Admin wallet:", (await ethers.getSigners())[0].address);
  console.log("Copy the contract address into public/app.js.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
