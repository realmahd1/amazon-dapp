const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Dappazon", () => {
  let dappazon;
  let deployer, buyer;
  const ID = 1
  const NAME = "Shoes"
  const CATEGORY = "Clothing"
  const IMAGE = "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg"
  const COST = tokens(1)
  const RATING = 4
  const STOCK = 5

  beforeEach(async () => {
    // Setup Accounts
    [deployer, buyer] = await ethers.getSigners();
    // Deploy contract
    const Dappazon = await ethers.getContractFactory("Dappazon");
    dappazon = await Dappazon.deploy();
  })

  describe("Deployment", () => {
    it("Sets the owner", async () => {
      expect(await dappazon.owner()).to.equal(deployer.address);
    })
  })

  describe('Listing', () => {
    let tranasction;

    beforeEach(async () => {
      tranasction = await dappazon.connect(deployer).list(
        ID,
        NAME,
        CATEGORY,
        IMAGE,
        COST,
        RATING,
        STOCK
      )

      await tranasction.wait();
    })

    it("Returns item attributes", async () => {
      const item = await dappazon.items(ID);

      expect(item.id).to.equal(ID);
      expect(item.name).to.equal(NAME);
      expect(item.category).to.equal(CATEGORY);
      expect(item.image).to.equal(IMAGE);
      expect(item.cost).to.equal(COST);
      expect(item.rating).to.equal(RATING);
      expect(item.stock).to.equal(STOCK);
    })

    it("Emits List event", () => {
      expect(tranasction).to.emit(dappazon, "List");
    })
  })

  describe('Buying', () => {
    let tranasction;

    beforeEach(async () => {
      // List an item
      tranasction = await dappazon.connect(deployer).list(
        ID,
        NAME,
        CATEGORY,
        IMAGE,
        COST,
        RATING,
        STOCK
      )
      await tranasction.wait();

      // Buy an item
      tranasction = await dappazon.connect(buyer).buy(ID, { value: COST });
    })

    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(dappazon.address);
      expect(result).to.equal(COST);
    })

    it("Updates buyer's order count", async () => {
      const result = await dappazon.orderCount(buyer.address);
      expect(result).to.equal(1);
    })

    it("Adds the order", async () => {
      const order = await dappazon.orders(buyer.address, 1);
      expect(order.time).to.be.greaterThan(0);
      expect(order.item.name).to.equal(NAME);
    })

    it("Emits Buy event", () => {
      expect(tranasction).to.emit(dappazon, "Buy");
    })
  })
})
