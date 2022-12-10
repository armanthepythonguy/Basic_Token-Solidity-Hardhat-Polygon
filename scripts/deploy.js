const hre = require("hardhat");
const { verify } = require("../utils/verify")

async function main() {
    let tokenContract = await hre.ethers.getContractFactory("Token")
    tokenContract = await tokenContract.deploy("BasicToken", "BT") // Deplotying the script onto the network choosen by the deployer
    await tokenContract.deployTransaction.wait(6) // Waiting for 6 block confirmations
    console.log(`Contract is deployed at :- ${tokenContract.address}`)
    await verify(tokenContract.address, ["BasicToken", "BT"]) // Calling the verify function to verify the smart contract after 6 block verification
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
