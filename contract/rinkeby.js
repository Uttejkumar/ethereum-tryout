const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
	'whip engage traffic situate urban limit sheriff glare never copy ten tragic',
	'https://rinkeby.infura.io/v3/c2814737e5ed4bcd936fca236f6c4974'
);

const web3 = new Web3(provider);

const deploy = async () => {
	const accounts = await web3.eth.getAccounts();

	console.log('Attempting to deploy from account: ' + accounts[0]);

	const contract = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({ data: '0x' + bytecode })
		.send({ from: accounts[0] });

	console.log('Contract deployed to: ' + contract.options.address);
}

const RinkebyContract = async (done) => {
	const contract = await new web3.eth.Contract(
		[
			[
				{
					"constant": false,
					"inputs": [
						{
							"name": "sysId",
							"type": "string"
						},
						{
							"name": "dataHash",
							"type": "string"
						}
					],
					"name": "saveAuditRecord",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function"
				},
				{
					"constant": true,
					"inputs": [
						{
							"name": "sysId",
							"type": "string"
						}
					],
					"name": "getAuditRecordsById",
					"outputs": [
						{
							"name": "",
							"type": "string[]"
						}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function"
				}
			]
		], '0x7dAdbc1a9DF168E49011814EB171f8DECD92084A' // Contract address
	);
	done(contract);
}

module.exports = RinkebyContract;