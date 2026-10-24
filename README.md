# Riphah International University — Blockchain-Based Voting System

Educational prototype for the Introduction to Crypto & Blockchain project.

## Features
- Solidity smart contract deployed to a local Hardhat blockchain.
- Admin-only election creation, candidate management, and voter registration.
- Each election specifies an eligible department (for example, `FC`).
- The contract rejects voters who are not registered, belong to another department, or have already voted.
- MetaMask wallet connection.
- Vote counts and basic browser-side election analysis.
- No application backend or database.

## Important limitation about AI
The "AI Analysis" panel uses lightweight, explainable client-side analytics (vote shares, leader, margin, distribution, and turnout when registered-voter counts are available). It does not call a generative AI model. This is intentional: a real AI API key must not be placed in a public browser-only app because visitors can extract it. If your instructor requires generative AI, add a small protected backend or use a local model service after discussing that extra setup with your instructor.

## Requirements
- Node.js LTS and npm
- MetaMask browser extension
- A desktop browser
- Internet access for loading ethers.js from its CDN (or download ethers locally if required)

## 1. Install dependencies
Open a terminal in this project folder and run:

```bash
npm install
```

## 2. Start the local blockchain
In Terminal 1:

```bash
npx hardhat node
```

Keep this terminal running. It prints test accounts and private keys. These accounts are for local testing only. Never use these private keys on a real network.

## 3. Deploy the smart contract
In Terminal 2, in the same project folder:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

Copy the contract address printed in the terminal.

Open `public/app.js` and replace `PASTE_DEPLOYED_CONTRACT_ADDRESS_HERE` with that address. Save the file.

## 4. Connect MetaMask to the local blockchain
In MetaMask, add a network:
- Network name: Hardhat Local
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Currency symbol: `ETH`

For local testing, import one of the test private keys printed by `npx hardhat node` into MetaMask. Use only a disposable local test account.

The account that deploys the contract is the administrator. Import the first Hardhat account to access admin functions. Other Hardhat accounts can be registered as student wallets.

## 5. Start the website
In Terminal 3:

```bash
npm run start
```

Then open `http://localhost:8080`.

If `npm run start` fails, use:

```bash
npx http-server public -p 8080
```

## 6. Use the application
1. Connect MetaMask.
2. As the deployer/admin, create an election. Enter a title and department code, such as `FC`, and an end time in the future.
3. Add candidates to the election.
4. Register each student wallet with a department code. Use exactly the same code as the election for eligible students.
5. Switch MetaMask to a registered student account and cast one vote.
6. Open the results section to see vote counts and the analysis.

### Department matching
Department codes are normalized to uppercase by the website. For example, `FC` and `fc` become `FC`. The smart contract compares the department code stored for the student with the code set for the election.

### Testing that a different department cannot vote
- Create an `FC` election.
- Register wallet B as `FC`.
- Register wallet C as `CS`.
- Switch to wallet B and vote: it should work.
- Switch to wallet C and try to vote: the contract should reject the transaction.
- Try to vote a second time from wallet B: the contract should reject it.

## Project structure

```text
Riphah_Blockchain_Voting_System/
├── contracts/
│   └── UniversityVoting.sol
├── scripts/
│   └── deploy.js
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── hardhat.config.js
├── package.json
└── README.md
```

## Security and academic scope
- This is a local educational demonstration, not a production election system.
- Blockchain transactions and wallet addresses are public on the chain. Do not put real student names, registration numbers, or other personal data on-chain.
- The admin is trusted to register the correct wallet-to-department association.
- A wallet is not the same as a verified student identity.
- Votes are not secret: this prototype records the selected candidate through blockchain transaction data. It must not be used for a real confidential election.
- Local Hardhat data is temporary. Restarting the local node resets the chain.
- Do not deploy this prototype to mainnet or use real funds.
