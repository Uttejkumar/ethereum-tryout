pragma solidity ^0.4.17;
pragma experimental ABIEncoderV2;

contract AuditTrail {

	mapping(string => string[]) audits;

	function saveAuditRecord(string sysId, string dataHash) external {
		audits[sysId].push(dataHash);
	}

	function getAuditRecordsById(string sysId) external view returns (string[] memory) {
		return audits[sysId];
	}
}