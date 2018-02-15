var ICO = artifacts.require("./SpadeIco.sol");

contract('ICO', function (accounts) {
    var account = accounts[0];
    var ico;

    before('setup', (done) => {
        ICO.deployed().then((_ico) => {
            ico = _ico;
            done();
        })
    });

    it("should deployed ICO contract has created status", () => {
        return ico.icoState.call()
            .then((s) => {
                assert.equal(0, s.valueOf(), "State should be 0");
            })
            .then(() => {
                return ico.isPaused.call();
            })
            .then((p) => {
                assert.equal(false, p.valueOf(), "ICO should be unpaused");
            })
    });

    it("should be running after start", () => {
        return ico.startIco()
            .then(() => {
                return ico.icoState.call();
            })
            .then((s) => {
                assert.equal(1, s.valueOf(), "State should be 1");
            })
            .then(() => {
                return ico.isPaused.call();
            })
            .then((p) => {
                assert.equal(false, p.valueOf(), "ICO should be unpaused");
            })
    });

    it("should be paused after pause", () => {
        return ico.pauseIco()
            .then(() => {
                return ico.icoState.call();
            })
            .then((s) => {
                assert.equal(1, s.valueOf(), "State should be 1");
            })
            .then(() => {
                return ico.isPaused.call();
            })
            .then((p) => {
                assert.equal(true, p.valueOf(), "ICO should be paused");
            })
    });

    it("should be unpaused after resume", () => {
        return ico.resumeIco()
            .then(() => {
                return ico.icoState.call();
            })
            .then((s) => {
                assert.equal(1, s.valueOf(), "State should be 1");
            })
            .then(() => {
                return ico.isPaused.call();
            })
            .then((p) => {
                assert.equal(false, p.valueOf(), "ICO should be paused");
            })
    });

    it("should be finished after finish", () => {
        return ico.finishIco(account,account)
            .then(() => {
                return ico.icoState.call();
            })
            .then((s) => {
                assert.equal(2, s.valueOf(), "State should be 2");
            })
    });
    
});