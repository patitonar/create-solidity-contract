pragma solidity >=0.4.25 <0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";


// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!
contract MetaCoin {
    using SafeMath for uint256;

    mapping(address => uint256) internal balances;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    constructor() public {
        balances[msg.sender] = 10000;
    }

    function sendCoin(address receiver, uint256 amount) public returns (bool sufficient) {
        if (balances[msg.sender] < amount) return false;
        balances[msg.sender] = balances[msg.sender].sub(amount);
        balances[receiver] = balances[receiver].add(amount);
        emit Transfer(msg.sender, receiver, amount);
        return true;
    }

    function getBalanceInEth(address addr) public view returns (uint256) {
        return getBalance(addr).mul(2);
    }

    function getBalance(address addr) public view returns (uint256) {
        return balances[addr];
    }
}
