pragma solidity ^0.5.0;

contract Token {
    string public name = "NOVA Token";
    string public symbol = 'NOVA';
    uint256 public decimals = 18;
    uint256 public totalSupply;

    //track balances
    mapping(address => uint256) public balanceOf;
    //send tokens

    constructor() public {
        totalSupply  = 1000000000000000000000000000000;
    }

}