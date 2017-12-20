let TokenRegistry = artifacts.require('./TokenRegistry.sol');
let NationStandardToken = artifacts.require('./NationStandardToken');

contract('Token creation testing', accounts => {

	let registryInstance = {};
	let nationToken = {};
	let nationName = "TestNation";

	it('Should be able initialize the registry and create a custom token', function() {
		return TokenRegistry.deployed().then(function(instance) {
			registryInstance = instance;
			return registryInstance.createStandardToken(nationName, 1000, "Test Nation Coin", 4, "TNC", {from: accounts[1]});
		}).then(function(txReceipt) {
			assert.equal(txReceipt.logs.length, 1, "There should have been one event emitted");
			assert.equal(txReceipt.logs[0].event, "TokenCreated", "The second event should have been TokenCreated");
			let tokenAddress = txReceipt.logs[0].args.tokenAddress;
			nationToken = NationStandardToken.at(tokenAddress);

			return nationToken.name();
		}).then(function(tokenName) {
			assert.equal(tokenName, "Test Nation Coin", "The token name should have been Test Nation Coin");

			return nationToken.nationName();
		}).then(function(tokenNationName) {
			assert.equal(tokenNationName, nationName, "The token nation should have been " + nationName);

			return nationToken.decimals();
		}).then(function(tokenDecimals) {
			assert.equal(tokenDecimals, 4, "The token should have 4 decimals");

			return nationToken.symbol();
		}).then(function(tokenSymbol) {
			assert.equal(tokenSymbol, "TNC", "The token symbol should be TNC");

			return nationToken.balanceOf(accounts[1]);
		}).then(function(tokenBalance) {
			assert.equal(tokenBalance.toNumber(), 1000, "The owner should have 1000 tokens");
		})
	})

});
