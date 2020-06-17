// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.7.0;

contract Migrations {
    address public owner;
    // solhint-disable-next-line var-name-mixedcase
    uint256 public last_completed_migration;

    modifier restricted() {
        if (msg.sender == owner) _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function setCompleted(uint256 completed) public restricted {
        last_completed_migration = completed;
    }
}
