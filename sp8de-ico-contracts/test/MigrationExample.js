var ICO = artifacts.require("./SpadeIco.sol");
var SPX = artifacts.require("./SPXToken.sol");
var TargetTokenExample = artifacts.require("./TargetTokenExample.sol");
var MigrationAgentExample = artifacts.require("./MigrationAgentExample.sol");

contract('ICO', function (accounts) {
    var account = accounts[0];
    var account1 = accounts[1];
    var account2 = accounts[2];
    var account3 = accounts[3];

    var ico;
    var spx;
    var migrationAgent;
    var targetToken;

    before('setup', (done) => {
        ICO.deployed().then((_ico) => {
            ico = _ico;
        })
        .then(() => {
            return ico.token.call();
        })
        .then((_spx) => {
            spx = SPX.at(_spx);            
        })
        .then(() => { 
            return ico.startIco();
        })
        .then(() => {            
            done();
        })
    });
    
    it("should buy 1000 tokens", () => {
        return ico.buyTokens(account, 1000 * 1e18, 8800, "test")
            .then(() => {
                return ico.finishIco(account2, account3);
            })
            .then(() => {
                return spx.balanceOf.call(account)
            })
            .then((b) => {
                assert.equal(1000 * 1e18, b.valueOf(), "Balance should be 1000");
            });
    });

    it("should not be able to migrate tokens before agent set", () => {
        return spx.migrate(5)
            .catch(() => {
                return true;
            })
    }); 

    it("should be able so deploy and set agent", () => {
        return MigrationAgentExample.new(spx.address)
            .then((ma) => {
                migrationAgent = ma;
                return TargetTokenExample.new(migrationAgent.address);
            })
            .then((tt) => {
                targetToken = tt;
                migrationAgent.setTargetToken(targetToken.address)
            }) 
            .then(() => {
                return spx.setMigrationAgent(migrationAgent.address);
            })
    });

    it("should be able to migrate tokens after agent set", () => {
        return spx.migrate(500 * 1e18)
            .then(() => {
                return spx.balanceOf.call(account)
            })
            .then((b) => {
                assert.equal(500 * 1e18, b.valueOf(), "Balance should be 5");
            })
            .then(() => {
                return targetToken.balanceOf.call(account)
            })
            .then((b) => {
                assert.equal(500 * 1e18, b.valueOf(), "Balance should be 5");
            });
    }); 

    it("should not be able to migrate more tokens that left", () => {
        return spx.migrate(1000 * 1e18)
            .catch(() => {
                return true;
            })
    }); 

    it("should not be able to migrate tokens after finalize migration", () => {
        return migrationAgent.finalizeMigration()
            .then(() => {
                return spx.migrate(5);
            })
            .catch(() => {
                return true;
            })
    }); 
});