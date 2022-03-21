import os
import logging

from web3 import Web3
from web3.auto import w3


CONTRACT_ABI = [
    {
        "constant": True,
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "wallet",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "raffle",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct RaffleSignatureVerifier.Participant",
                "name": "participant",
                "type": "tuple"
            },
            {
                "internalType": "bytes32",
                "name": "r",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "s",
                "type": "bytes32"
            },
            {
                "internalType": "uint8",
                "name": "v",
                "type": "uint8"
            }
        ],
        "name": "verify",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "payable": False,
        "stateMutability": "pure",
        "type": "function"
    }
]


class PoapIntegrationService:
    contract_address = os.getenv('VERIFY_CONTRACT_ADDRESS', '')

    def valid_participant_address(self, address, signature, raffle_id):
        logger = logging.getLogger("app")
        contract = w3.eth.contract(address=self.contract_address, abi=CONTRACT_ABI)

        if signature.startswith('0x'):
            signature = signature[2:]
            r = '0x' + signature[0: 64]
            s = '0x' + signature[64: 128]
            v = int(signature[128: 130], 16)

            if v == 0 or v == 1:
                v = v + 27

            signer = contract.functions.verify([Web3.toChecksumAddress(address.lower()), raffle_id], r, s, v).call()
            logger.info(f"INFO >> Signature validation >> Comparing: {signer.lower()} vs {address.lower()}")
            return address.lower() == signer.lower()

        logger.info(f"INFO >> Signature validation >> Not a valid signature: {signature}")
        return True
