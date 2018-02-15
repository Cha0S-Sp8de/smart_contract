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

    it("should buy 3655555558 tokens", () => {
        return ico.buyTokens(account, (3655555558 * 1e18), 888, "txtest")
            .then(() => {
                return spx.balanceOf.call(account)
            })
            .then((b) => {
                assert.equal(3655555558 * 1e18, b.valueOf(), "Balance should be 8,888,888,888");
            });
    });

    it("should not buy tokens", () => {
        return ico.buyTokens(account, (1 * 1e18), 888, "txtest")
            .catch(() => {
                return true;
            })
            .then(() => {
                return spx.balanceOf.call(account);
            })
            .then((b) => {
                assert.equal(3655555558 * 1e18, b.valueOf(), "Balance should be MAX");
            });
    });

    it("should not buy tokens", () => {
        return ico.buyTokens(account, (1 * 1e18), 888, "txtest")
            .catch(() => {
                return true;
            })
            .then(() => {
                return spx.balanceOf.call(account);
            })
            .then((b) => {
                assert.equal(3655555558 * 1e18, b.valueOf(), "Balance should be MAX");
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
                assert.equal((1777777778) * 1e18, b.valueOf(), "Foundation Balance should be");
            });
    });

});