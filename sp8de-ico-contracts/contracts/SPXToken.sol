pragma solidity ^0.4.18;

import "./StandardToken.sol";
import './SafeMath.sol';

// Migration Agent interface
contract MigrationAgent {
  function migrateFrom(address _from, uint _value) public;
}

/**
 * @title Spade Token
 */
contract SPXToken is StandardToken {

  string public constant name = "SP8DE Token";
  string public constant symbol = "SPX";
  uint8 public constant decimals = 18;
  address public ico;
  
  bool public isFrozen = true;  
  uint public constant TOKEN_LIMIT = 8888888888 * (1e18);

  // Token migration variables
  address public migrationMaster;
  address public migrationAgent;
  uint public totalMigrated;

  event Migrate(address indexed _from, address indexed _to, uint _value);
  
  // Constructor
  function SPXToken(address _ico, address _migrationMaster) public {
    require(_ico != 0);
    ico = _ico;
    migrationMaster = _migrationMaster;
  }

  // Create tokens
  function mint(address holder, uint value) public {
    require(msg.sender == ico);
    require(value > 0);
    require(totalSupply + value <= TOKEN_LIMIT);

    balances[holder] += value;
    totalSupply += value;
    Transfer(0x0, holder, value);
  }

  // Allow token transfer.
  function unfreeze() public {
      require(msg.sender == ico);
      isFrozen = false;
  }

  // ERC20 functions
  // =========================
  function transfer(address _to, uint _value) public returns (bool) {
    require(_to != address(0));
    require(!isFrozen);
    return super.transfer(_to, _value);
  }

  function transferFrom(address _from, address _to, uint _value) public returns (bool) {
    require(!isFrozen);
    return super.transferFrom(_from, _to, _value);
  }

  function approve(address _spender, uint _value) public returns (bool) {
    require(!isFrozen);
    return super.approve(_spender, _value);
  }

  // Token migration
  function migrate(uint value) external {
    require(migrationAgent != 0);
    require(value > 0);
    require(value <= balances[msg.sender]);

    balances[msg.sender] -= value;
    totalSupply -= value;
    totalMigrated += value;
    MigrationAgent(migrationAgent).migrateFrom(msg.sender, value);
    Migrate(msg.sender, migrationAgent, value);
  }

  // Set address of migration contract
  function setMigrationAgent(address _agent) external {
    require(migrationAgent == 0);
    require(msg.sender == migrationMaster);
    migrationAgent = _agent;
  }

  function setMigrationMaster(address _master) external {
    require(msg.sender == migrationMaster);
    require(_master != 0);
    migrationMaster = _master;
  }
}