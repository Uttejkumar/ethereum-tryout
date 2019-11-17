const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const getContract = require('./contract/deploy');
const getRinkebyContract = require('./contract/rinkeby');

const app = express();

app.use(bodyParser());
app.use(cors());

let testContract;
let testAccount;

let logs = [];

getContract((contract, acct) => {
	testContract = contract;
	testAccount = acct;
	console.log('Test contract up and running...');
});

let rinkebyContract;
let rinkebyAccount = '0x8A13B8a47C1BcbB07A8881309C89470D9012e591';

getRinkebyContract((contract) => {
	rinkebyContract = contract;
	console.log('Rinkeby contract up and running...');
})

/* --------------------------------------------
	Local ganache network operations
--------------------------------------------- */
app.post('/test', async (req, res) => {
	try {
		logs.push('Test: POST: ' + req.body.data.sys_id + ' | ' + req.body.data.hash);
		let result = await testContract.methods.saveAuditRecord(req.body.data.sys_id, req.body.data.hash).send({ from: testAccount, gas: 1000000 });
		return res.json({ 'transactionHash': result.transactionHash });
	} catch (err) {
		return res.json({ 'error': JSON.stringify(err) });
	}
});

app.get('/test', async (req, res) => {
	try {
		logs.push('Test: GET: ' + req.query.sys_id);
		let result = await testContract.methods.getAuditRecordsById(req.query.sys_id).call();
		return res.json({ 'hashes': result });
	} catch (err) {
		return res.json({ 'error': JSON.stringify(err) });
	}
});

/* --------------------------------------------
	Rinkeby test network APIs
--------------------------------------------- */
app.post('/rinkeby', async (req, res) => {
	try {
		logs.push('Rinkeby: POST: ' + req.body.data.sys_id + ' | ' + req.body.data.hash);
		let result = await rinkebyContract.methods.saveAuditRecord(req.body.data.sys_id, req.body.data.hash).send({ from: rinkebyAccount, gas: 1000000 });
		return res.json({ 'transactionHash': result.transactionHash });
	} catch (err) {
		return res.json({ 'error': JSON.stringify(err) });
	}
});

app.get('/rinkeby', async (req, res) => {
	try {
		logs.push('Rinkeby: GET: ' + req.query.sys_id);
		let result = await rinkebyContract.methods.getAuditRecordsById(req.query.sys_id).call();
		return res.json({ 'hashes': result });
	} catch (err) {
		return res.json({ 'error': JSON.stringify(err) });
	}
});

/* --------------------------------------------
	Miscelleneous Server APIs
--------------------------------------------- */
app.get('/restart', async (req, res) => {
	try {
		await getContract((contract, acct) => {
			testContract = contract;
			testAccount = acct;
		});

		await getRinkebyContract((contract) => {
			rinkebyContract = contract;
		})

		if (testAccount && testContract && rinkebyContract) {
			return res.json({ 'msg': 'Restart successful.' });
		} else {
			return res.json({ 'msg': 'Restart failed.' });
		}
	} catch (err) {
		return res.json({ 'error': JSON.stringify(err) });
	}
});

app.get('/status', (req, res) => {
	try {
		if (testContract && testAccount && rinkebyContract)
			return res.json({ 'msg': 'Test and rinkeby contracts are up and running...' });
		else {
			if (testContract && testAccount)
				return res.json({ 'msg': 'Only Test contract is up and running...' });
			if (rinkebyContract)
				return res.json({ 'msg': 'Only Rinkeby contract is up and running...' });
			return res.json({ 'msg': 'Neither Test nor Rinkeby contracts are running...' });
		}
	} catch (err) {
		return res.json({ 'error': JSON.stringify(err) });
	}
});

app.get('/health', (req, res) => {
	return res.json({ 'msg': 'Server up and running.' });
})

app.get('/logs', (req, res) => {
	return res.json({ 'logs': logs })
})

app.get('/clear-logs', (req, res) => {
	logs = [];
	return res.json({ 'msg': 'Logs cleared.' });
})

app.listen(process.env.PORT || 5000, () => console.log('Server running...'));