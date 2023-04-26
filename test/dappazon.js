const { expect } = require('chai')

describe('Dappazon', () => {
    it('Has name', async () => {
        const Dappazon = await ethers.getContractFactory('Dappazon')
        const dappazon = await Dappazon.deploy()
        expect(await dappazon.name()).to.equal('Dappazon')
    })
})