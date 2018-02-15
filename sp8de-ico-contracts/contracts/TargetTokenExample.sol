pragma solidity ^0.4.18;

import "./StandardToken.sol";

contract TargetTokenExample is StandardToken {
    
    address public migrationAgent;

    // Constructor
    function TargetTokenExample(address _migrationAgent) public {
        migrationAgent = _migrationAgent;
    }

    // Migration related methods
    function createToken(address _target, uint _amount)  public {
        require (msg.sender == migrationAgent);

        balances[_target] += _amount;
        totalSupply += _amount;

        Transfer(migrationAgent, _target, _amount);
    }

    function finalizeMigration()  public {
        require (msg.sender == migrationAgent);

        migrationAgent = 0;
    }
}