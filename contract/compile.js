const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, 'AuditTrail.sol');
const source = fs.readFileSync(contractPath, 'utf-8');

module.exports = solc.compile(source, 1).contracts[':AuditTrail'];