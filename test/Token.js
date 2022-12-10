const { ethers } = require('hardhat')
const { expect } = require('chai')


describe("Checking the workflow of the basic token contract :- ", ()=>{
    let deployer, user1, user2, tokenContract

    // In this particular beforeEach block we are fetching the contract and deplying it to the local network
    beforeEach(async()=>{
        let accounts = await ethers.getSigners()
        deployer = accounts[0]
        user1 = accounts[1]
        user2 = accounts[2]
        tokenContract = await ethers.getContractFactory("Token")
        tokenContract = await tokenContract.deploy("BasicToken", "BT")
    })


    it("Checking if token's name and symbol is being stored correctly", async()=>{
        let name = await tokenContract.connect(user1).name()
        expect(name).to.equal("BasicToken")
        let symbol = await tokenContract.connect(user1).symbol()
        expect(symbol).to.equal("BT")
    })

    it("Checking if the mint function is working ", async() =>{
        await tokenContract.connect(deployer).mint(100, user1.address)
        let totalSupply = await tokenContract.connect(user1).totalSupply()
        expect(totalSupply).to.equal(100)
        let balance = await tokenContract.connect(user1).balanceOf(user1.address)
        expect(balance).to.equal(100)
        expect(async()=> await tokenContract.connect(user1).mint(100, user1.address)).to.be.revertedWith("Only the owner can call this function")
        totalSupply = await tokenContract.connect(user1).totalSupply()
        expect(totalSupply).to.equal(100)
        balance = await tokenContract.connect(user1).balanceOf(user1.address)
        expect(balance).to.equal(100)
    })

    it("Checking if the burn function is working", async()=>{
        await tokenContract.connect(deployer).mint(100, user1.address)
        let totalSupply = await tokenContract.connect(user1).totalSupply()
        expect(totalSupply).to.equal(100)
        let balance = await tokenContract.connect(user1).balanceOf(user1.address)
        expect(balance).to.equal(100)
        expect(async()=> await tokenContract.connect(user1).burn(1000)).to.be.revertedWith("Not enough balance to burn")
        await tokenContract.connect(user1).burn(50)
        totalSupply = await tokenContract.connect(user1).totalSupply()
        expect(totalSupply).to.equal(50)
        balance = await tokenContract.connect(user1).balanceOf(user1.address)
        expect(balance).to.equal(50)
        await tokenContract.connect(user1).burn(50)
        totalSupply = await tokenContract.connect(user1).totalSupply()
        expect(totalSupply).to.equal(0)
        balance = await tokenContract.connect(user1).balanceOf(user1.address)
        expect(balance).to.equal(0)
    })
    
    it("Checking the transfer function", async()=>{
        await tokenContract.connect(deployer).mint(100, user1.address)
        let totalSupply = await tokenContract.connect(user1).totalSupply()
        expect(totalSupply).to.equal(100)
        let balance = await tokenContract.connect(user1).balanceOf(user1.address)
        expect(balance).to.equal(100)
        await tokenContract.connect(user1).transfer(50, user2.address)
        balance = await tokenContract.connect(user1).balanceOf(user1.address)
        expect(balance).to.equal(50)
        balance = await tokenContract.connect(user2.address).balanceOf(user2.address)
        expect(balance).to.equal(50)
        expect(async()=> await tokenContract.connect(user1).transfer(100, user2.address)).to.be.revertedWith("Not enough balance")
    })

    it("Checking if the transferThirdParty function is working", async()=>{
        await tokenContract.connect(deployer).mint(100, user1.address)
        let totalSupply = await tokenContract.connect(user1).totalSupply()
        expect(totalSupply).to.equal(100)
        let balance = await tokenContract.connect(user1).balanceOf(user1.address)
        expect(balance).to.equal(100)
        expect(async()=> await tokenContract.connect(user1).addAllowance(1000, user2.address)).to.be.revertedWith("Not enough balance")
        await tokenContract.connect(user1).addAllowance(100, user2.address)
        let allowance = await tokenContract.connect(user1).getAllowance(user2.address)
        expect(allowance).to.equal(100)
        await tokenContract.connect(user1).removeAllowance(user2.address)
        allowance = await tokenContract.connect(user1).getAllowance(user2.address)
        expect(allowance).to.equal(0)
        await tokenContract.connect(user1).addAllowance(100, user2.address)
        allowance = await tokenContract.connect(user1).getAllowance(user2.address)
        expect(allowance).to.equal(100)
        expect(async()=> await tokenContract.connect(deployer).transferThirdParty(user1.address, user2.address, 200)).to.be.revertedWith("Allowance not enough")
        await tokenContract.connect(deployer).transferThirdParty(user1.address, user2.address, 100)
        balance = await tokenContract.connect(user1).balanceOf(user1.address)
        expect(balance).to.equal(0)
        balance = await tokenContract.connect(user2.address).balanceOf(user2.address)
        expect(balance).to.equal(100)
    })

})