var ICO = artifacts.require("./SpadeIco.sol");
var SPX = artifacts.require("./SPXToken.sol");

contract('ICO', function (accounts) {
    var account = accounts[0];
    var foundation = accounts[1];
    var other = accounts[2];
    var ico;
    var spx; 

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

    it("should credit Jackpot Tokens 8000000000 tokens", () => {
        return ico.creditJackpotTokens(account, (8000000000 * 1e18), 1)
            .then(() => {
                return spx.balanceOf.call(account)
            })
            .then((b) => {
                assert.equal(8000000000 * 1e18 , b.valueOf(), "Balance should be 8000000000");
            });
    });
   

    it("should be finished after finish", () => {
        return ico.finishIco(foundation, other)
            .then(() => {
                return ico.icoState.call();
            })
            .then((s) => {
                assert.equal(2, s.valueOf(), "State should be 2");
            })
            .then( () => {
                return spx.balanceOf.call(foundation)
            })
            .then((b) => {
                assert.equal((888888888) * 1e18, b.valueOf(), "Foundation Balance should be");
            });
    });

    it("should not buy tokens", () => {
        return ico.buyTokens(account, (1 * 1e18), 888, "txtest")
            .catch(() => {
                return true;
            });
    });

});