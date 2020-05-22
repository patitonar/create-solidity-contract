// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";


// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!
contract MetaCoin {
    using SafeMath for uint256;

    mapping(address => uint256) internal balances;

    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor() public {
        balances[msg.sender] = 1 ether;
    }

    function sendCoin(address receiver, uint256 amount) public returns (bool sufficient) {
        require(balances[msg.sender] >= amount, "balance insufficient");
        balances[msg.sender] = balances[msg.sender].sub(amount);
        balances[receiver] = balances[receiver].add(amount);
        emit Transfer(msg.sender, receiver, amount);
        return true;
    }

    function getBalance(address addr) public view returns (uint256) {
        return balances[addr];
    }
}
