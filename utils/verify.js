const { run } = require("hardhat")

const verify = async (contractAddress, args) => {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", { 
      address: contractAddress, // Passing in the address for the verification
      constructorArguments: args, // Passing in the constructor arguments for verification
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!") // This means that the smart contract is already verified
    } else {
      console.log(e)
    }
  }
}

module.exports = { verify }

// This particular script is made for verification of the smart contract in the scanner's website once it is deployed