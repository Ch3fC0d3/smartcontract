const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
  // Test variables
  let MyToken;
  let myToken;
  let owner;
  let addr1;
  let addr2;
  let initialSupply;

  // Setup before each test
  beforeEach(async function () {
    // Get signers for testing
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // Get initial supply from env or use default
    initialSupply = process.env.INITIAL_SUPPLY || "1000000";

    // Deploy the contract
    MyToken = await ethers.getContractFactory("MyToken");
    myToken = await MyToken.deploy(initialSupply);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await myToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await myToken.balanceOf(owner.address);
      const totalSupply = await myToken.totalSupply();
      expect(totalSupply).to.equal(ownerBalance);
    });

    it("Should have correct initial supply", async function () {
      const totalSupply = await myToken.totalSupply();
      const expectedSupply = ethers.parseUnits(initialSupply, 18); // 18 decimals
      expect(totalSupply).to.equal(expectedSupply);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      const transferAmount = ethers.parseUnits("50", 18);
      await myToken.transfer(addr1.address, transferAmount);
      
      // Check balances after transfer
      const addr1Balance = await myToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(transferAmount);

      // Transfer 50 tokens from addr1 to addr2
      await myToken.connect(addr1).transfer(addr2.address, transferAmount);
      const addr2Balance = await myToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(transferAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await myToken.balanceOf(owner.address);
      
      // Try to send more tokens than available
      // OpenZeppelin v5.x uses custom errors instead of revert strings
      await expect(
        myToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWithCustomError(myToken, "ERC20InsufficientBalance");

      // Owner balance shouldn't have changed
      expect(await myToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint new tokens", async function () {
      const mintAmount = ethers.parseUnits("100", 18);
      const initialSupply = await myToken.totalSupply();
      
      // Mint new tokens
      await myToken.mint(addr1.address, mintAmount);
      
      // Check balance of recipient
      expect(await myToken.balanceOf(addr1.address)).to.equal(mintAmount);
      
      // Check total supply increased
      expect(await myToken.totalSupply()).to.equal(initialSupply + mintAmount);
    });

    it("Should prevent non-owners from minting", async function () {
      // Try to mint tokens from non-owner account
      await expect(
        myToken.connect(addr1).mint(addr2.address, ethers.parseUnits("100", 18))
      ).to.be.revertedWithCustomError(myToken, "OwnableUnauthorizedAccount");
    });
  });
});
