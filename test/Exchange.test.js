



import { tokens } from './helpers'
import { EVM_REVERT } from './helpers'

const Token = artifacts.require('./Token')
const Exchange = artifacts.require('./Exchange')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Exchange', ([deployer, feeAccount, user1]) => {
    let token
    let exchange
    const feePercent = 10

    beforeEach(async() => {
        token = await Token.new()//deploy token
        token.transfer(user1, tokens(100), { from: deployer })//give tokens to user1
        exchange = await Exchange.new(feeAccount, feePercent)//deploy exchange
    })

    describe('deployment', () => {
        it('tracks the fee account', async() => {
            const result = await exchange.feeAccount()
            result.should.equal(feeAccount)
        })
        
        it('tracks the fee percent', async() => {
            const result = await exchange.feePercent()
            result.toString().should.equal(feePercent.toString())
        })
        
    })

    describe('depositing tokens', () => {
        let result
        let amount
        let balance

        beforeEach(async () => {
            amount = tokens(10)
            await token.approve(exchange.address, amount, { from: user1 })
            result = await exchange.depositToken(token.address, amount, { from: user1 })
            })

        describe('success', () => {
            beforeEach(async () => {
            amount = tokens(10)
            await token.approve(exchange.address, amount, { from: user1 })
            result = await exchange.depositToken(token.address, amount, { from: user1 })
            })
            
            it('tracks token deposits', async () => {
                balance = await token.balanceOf(exchange.address)
                balance.toString().should.equal(tokens(20).toString())
                balance = await exchange.tokens(token.address, user1)
                balance.toString().should.equal(tokens(20).toString())
            })
        })

            it('emits a Deposit event', () => {
                const log = result.logs[0]
                log.event.should.eq('Deposit')
                const event = log.args
                event.token.should.equal(token.address, 'token address is correct')
                event.user.should.equal(user1, 'user address is correct')
                event.amount.toString().should.equal(tokens(10).toString(), 'amount is correct')
                event.balance.toString().should.equal(tokens(10).toString(), 'balance is correct')
            })

        describe('failure', () => {
            it('rejects Ether transfers', async () => {
                await exchange.depositToken(token.address, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
            })

            it('fails when no tokens are approved', async () => {
                await exchange.depositToken(token.address, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
            })
            
        })

    })

})