const { expect } = require('chai')

const ID = 1;
const NAME = 'Shoes';
const CATEGORY = 'Clothing';
const IMAGE = 'IMAGE';
const COST = 1;
const RATING = 4;
const STOCK = 5;

describe('Dappazon', () => {
    let dappazon
    let deployer, buyer
    beforeEach(async () => {
        // Setup Accounts
        [deployer, buyer] = await ethers.getSigners()

        // Deploy the contract
        const Dappazon = await ethers.getContractFactory('Dappazon')
        dappazon = await Dappazon.deploy()
    })

    describe('Deployment', () => {
        it('Set the owner', async () => {
            expect(await dappazon.i_owner()).to.equal(deployer.address)
        })
    })

    describe('Listing', () => {
        let transaction
        beforeEach(async () => {
            transaction = await dappazon.connect(deployer).list(
                ID,
                NAME,
                CATEGORY,
                IMAGE,
                COST,
                RATING,
                STOCK
            )
            await transaction.wait()
        })

        it('Returns item', async () => {
            const item = await dappazon.items(ID);

            expect(item.id).to.equal(ID)
            expect(item.name).to.equal(NAME)
            expect(item.category).to.equal(CATEGORY)
            expect(item.image).to.equal(IMAGE)
            expect(item.cost).to.equal(COST)
            expect(item.rating).to.equal(RATING)
            expect(item.stock).to.equal(STOCK)
        })

        it("Emit List event", async () => {
            await expect(transaction).to.emit(dappazon, "List")
        })

    })
    describe('Buying', () => {
        let transaction
        beforeEach(async () => {
            transaction = await dappazon.connect(deployer).list(
                ID,
                NAME,
                CATEGORY,
                IMAGE,
                COST,
                RATING,
                STOCK
            )
            await transaction.wait()

            transcation = await dappazon.connect(buyer).buy(ID, { value: COST })
        })

        it("Updates buyers's order count", async () => {
            const result = await dappazon.orderCount(buyer.address)
            expect(result).to.equal(1);
        })

        it("Adds the order", async () => {
            const order = await dappazon.orders(buyer.address, 1);

            expect(order.time).to.be.greaterThan(0);
            expect(order.item.name).to.equal(NAME);
        })

        it("Updates the contract balance", async () => {
            const result = await ethers.provider.getBalance(dappazon.address);
            expect(result).to.equal(COST);
        })

        it("Emits buy event", async () => {
            await expect(transaction).to.emit(dappazon, "Buy");
        })
    })
})
