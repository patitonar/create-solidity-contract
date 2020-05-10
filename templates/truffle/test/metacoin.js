const { expectEvent, expectRevert, BN, ether } = require('@openzeppelin/test-helpers')
const { expect } = require('chai')

const MetaCoin = artifacts.require('MetaCoin')

const toBN = (n) => new BN(n)

contract('MetaCoin', (accounts) => {
  it('should put 1 ether of MetaCoin in the first account', async () => {
    const metaCoinInstance = await MetaCoin.new()
    const balance = toBN(await metaCoinInstance.getBalance(accounts[0]))

    expect(balance).to.be.bignumber.equal(ether('1'), "Amount wasn't correctly taken from the sender")
  })
  it('should send coin correctly', async () => {
    const metaCoinInstance = await MetaCoin.new()

    // Setup 2 accounts.
    const accountOne = accounts[0]
    const accountTwo = accounts[1]

    // Get initial balances of first and second account.
    const accountOneStartingBalance = toBN(await metaCoinInstance.getBalance(accountOne))
    const accountTwoStartingBalance = toBN(await metaCoinInstance.getBalance(accountTwo))

    // Make transaction from first account to second.
    const amount = ether('1')
    const receipt = await metaCoinInstance.sendCoin(accountTwo, amount, { from: accountOne })

    // Get balances of first and second account after the transactions.
    const accountOneEndingBalance = toBN(await metaCoinInstance.getBalance(accountOne))
    const accountTwoEndingBalance = toBN(await metaCoinInstance.getBalance(accountTwo))

    expect(accountOneEndingBalance).to.be.bignumber.equal(
      accountOneStartingBalance.sub(toBN(amount)),
      "Amount wasn't correctly taken from the sender"
    )
    expect(accountTwoEndingBalance).to.be.bignumber.equal(
      accountTwoStartingBalance.add(toBN(amount)),
      "Amount wasn't correctly sent to the receiver"
    )
    expectEvent(receipt, 'Transfer', {
      from: accountOne,
      to: accountTwo,
      value: amount,
    })
  })
  it('should fail on insufficient balance', async () => {
    const metaCoinInstance = await MetaCoin.new()

    // Setup 2 accounts.
    const accountOne = accounts[0]
    const accountTwo = accounts[1]

    // Make transaction from first account to second.
    const amount = ether('2')
    await expectRevert(metaCoinInstance.sendCoin(accountTwo, amount, { from: accountOne }), 'balance insufficient')
  })
})
