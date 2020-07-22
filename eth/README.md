<h1 align="center">POAP Raffle Signature Validator</h1>
<p align="center">🎖️ Validate EIP712 signature onchain 🎖️</p>

## Inspiration ##
[POAP fun](https://poap.fun) users will sign messages based on EIP712 and the backend needs to validate the signed.

### Signed message ###
Based on the EIP712, messages look like this:

```json
{
   "types":{
      "EIP712Domain":[
         {
            "name":"name",
            "type":"string"
         },
         {
            "name":"version",
            "type":"string"
         },
         {
            "name":"chainId",
            "type":"uint256"
         },
         {
            "name":"salt",
            "type":"bytes32"
         }
      ],
      "Participant":[
         {
            "name":"wallet",
            "type":"address"
         },
         {
            "name":"raffle",
            "type":"uint256"
         }
      ]
   },
   "domain":{
      "name":"POAP.fun",
      "version":"1",
      "chainId":1,
      "salt":""
   },
   "primaryType":"Participant",
   "message":{
      "wallet":"0x..",
      "raffle": 1
   }
}

```

## Setup ##
This project uses [buidler](https://buidler.dev) to compile, test and deploy the contracts.

Install dependencies
```
yarn install
```


## Useful commands ##

```bash
yarn compile        # Compile contract
```

### Deploy ###
Copy of `.env.template` to `.env` and complete with your variables before running the script below
```bash
npx buidler run scripts/deploy.js
```

## Deployed contracts ##
 - Mainnet: [0x75422c02752C86Cde052c580aBCd5E0A0F5F9968](https://etherscan.io/address/0x75422c02752C86Cde052c580aBCd5E0A0F5F9968)
 - Ropsten: [0x9714882B5bB3627527E22D659D3B28EAe0605dbe](https://ropsten.etherscan.io/address/0x9714882B5bB3627527E22D659D3B28EAe0605dbe)

## TODO list ##
- [] Add tests
