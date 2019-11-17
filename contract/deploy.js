const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('./compile');

const deploy = async (done) => {
	const accounts = await web3.eth.getAccounts();

	const contract = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({ data: bytecode })
		.send({ gas: '1000000', from: accounts[0] });
	
	done(contract, accounts[0]);
}

module.exports = deploy;