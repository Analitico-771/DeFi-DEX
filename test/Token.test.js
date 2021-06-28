

import { tokens } from './helpers'
import { EVM_REVERT } from './helpers'
const Token = artifacts.require('./Token')
require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Token', ([deployer, receiver]) => {
    const name = 'NOVA Token'
    const symbol = 'NOVA'
    const decimals = '18'
    const totalSupply = tokens(1000000000000).toString()
    let token = 0;

    beforeEach(async() => {
        token = await Token.new() 
    })

    describe('deployment', () => {
        it('tracks the name', async() => {
            const result = await token.name()
            result.should.equal(name)
        })

        it('tracks the symbol', async() => {
            const result = await token.symbol()
            result.should.equal(symbol)
        })

        it('tracks the decimals', async() => {
            const result = await token.decimals()
            result.toString().should.equal(decimals)
        })

        it('tracks the total supply', async() => {
            const result = await token.totalSupply()
            result.toString().should.equal(totalSupply.toString())
        })

        it('assigns the total supply to the deployer', async() => {
            const result = await token.balanceOf(deployer)
            result.toString().should.equal(totalSupply.toString())
        })
    })

    describe('sending tokens', () => {
        let amount = '';
        let result = '';
        
        describe('success', async () => {
            beforeEach(async () => {
                amount = tokens(100)
                result = await token.transfer(receiver, amount, { from: deployer })
                })
                
            it('transfers token balances', async () => {
                let balanceOf = await token.balanceOf(deployer)
                balanceOf.toString().should.equal(tokens(999999999900).toString())
                balanceOf = await token.balanceOf(receiver)
                balanceOf.toString().should.equal(tokens(100).toString())
            })

            it('emits a Transfer event', () => {
                const log = result.logs[0]
                log.event.should.eq('Transfer')
                const event = log.args
                event.from.toString().should.equal(deployer, 'from is correct')
                event.to.should.equal(receiver, 'to is correct')
                event.value.toString().should.equal(amount.toString(), 'value is correct')
            })
        })

        describe('failure', async () => {

            it('rejects insufficient balances', async () => {
                
                let invalidAmount = tokens(100000000000000000)//more than the current supply
                await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_REVERT)
            })

            // it('emits a Transfer event', () => {
            //     const log = result.logs[0]
            //     log.event.should.eq('Transfer')
            //     const event = log.args
            //     event.from.toString().should.equal(deployer, 'from is correct')
            //     event.to.should.equal(receiver, 'to is correct')
            //     event.value.toString().should.equal(amount.toString(), 'value is correct')
            // })
        })

    })
})