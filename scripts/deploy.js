// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const ethers = hre.ethers

async function main() {
  const [signer] = await ethers.getSigners()

    let Vote = await ethers.getContractFactory("Vote", signer)
    let vote = await Vote.deploy()
    await vote.deployed()

   
  console.log(vote.address) //0x19c75fd182652eC7f265194B578340A29b06DFD7
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
 