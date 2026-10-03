# 🗳️ Blockchain-Based Voting System

A simple educational web-based voting application that uses **Ethereum
blockchain technology** and a **Solidity smart contract** to record
votes in a transparent and tamper-resistant way.

> **Target Use:** University / Classroom Elections\
> **Blockchain:** Ethereum\
> **Smart Contract:** Solidity

------------------------------------------------------------------------

## 👨‍🎓 Project Information

**Project Title:** Blockchain-Based E-Voting System

**Project Type:** Semester Project

**Semester:** 7th Semester

**Instructor:** Mubariz Rehman

**Degree Program:** Bachelor of Science in Computer Science (BSCS)

**Department:** Faculty of Computing

**University:** Riphah International University

------------------------------------------------------------------------

## 👥 Project Team

| # | Team Member | SAP |
|---|---|---|
| 1 | **Sharaiz Ahmed** | 57288 |
| 2 | **Abdul Moiz** | 54482 |

------------------------------------------------------------------------

## 📌 Overview

The **Blockchain-Based Voting System** is a decentralized web
application designed for small-scale university or classroom elections.

Voters connect their **MetaMask** wallets, view eligible candidates,
select a candidate, and submit their vote through a blockchain
transaction. The **Solidity smart contract** validates voter
eligibility, prevents duplicate voting, records votes, and maintains
vote counts.

The project demonstrates how blockchain and smart contracts can be used
for secure and transparent vote record-keeping.

> ⚠️ **Important:** This project is an educational prototype. It is
> **not intended for national, governmental, or legally binding
> elections**.

------------------------------------------------------------------------

## 🎯 Problem Statement

Traditional voting processes can involve paperwork and manual record
management. Online voting systems can also raise concerns about the
integrity and unauthorized modification of voting records.

This project explores blockchain as a solution for the **record-keeping
aspect** of a small-scale online voting system. Once a vote is recorded
on the blockchain, the transaction is difficult to modify or delete.

The project focuses on demonstrating:

-   Blockchain-based vote recording
-   Smart contract-based voting rules
-   Voter eligibility verification
-   One-person-one-vote enforcement at the smart-contract level
-   Transparent vote counting
-   Blockchain transaction verification

------------------------------------------------------------------------

## 💡 Proposed Solution

The system provides separate functionality for an **administrator** and
**registered voters**.

### Administrator

The administrator can:

-   Create and manage an election
-   Add candidates
-   Register eligible voters
-   Start and end the election
-   Monitor and view election results

### Voter

A registered voter can:

-   Connect a MetaMask wallet
-   Verify wallet eligibility
-   View available candidates
-   Cast one vote
-   Confirm the blockchain transaction
-   View election results after the election ends

### Smart Contract

The Solidity smart contract is responsible for:

-   Maintaining candidate information
-   Maintaining registered voter addresses
-   Verifying voter eligibility
-   Preventing duplicate voting
-   Recording votes
-   Maintaining vote counts
-   Providing election results
-   Restricting administrative functions to the authorized administrator

------------------------------------------------------------------------

## ✨ Key Features

  -----------------------------------------------------------------------
  Feature                             Description
  ----------------------------------- -----------------------------------
  🔐 Voter Registration               Administrator registers eligible
                                      wallet addresses

  👛 MetaMask Integration             Voters connect their blockchain
                                      wallet

  🗳️ One-Person-One-Vote              A registered wallet cannot vote
                                      more than once

  ⛓️ Blockchain Voting                Votes are recorded through
                                      blockchain transactions

  📋 Candidate Management             Administrator can add candidates

  ⚙️ Election Management              Administrator can start and end
                                      elections

  📊 Results                          Vote counts are displayed after the
                                      election

  🔎 Transaction Verification         Voting transactions can be verified
                                      on the blockchain

  🛡️ Smart Contract Validation        Voting rules are enforced by the
                                      smart contract
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 🔄 System Workflow

``` text
                 ┌───────────────────┐
                 │   Administrator   │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Create Election   │
                 │ & Add Candidates  │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Register Voters   │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │    Voter Opens    │
                 │     Website       │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Connect MetaMask  │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Select Candidate  │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Smart Contract    │
                 │ Validates Vote    │
                 └─────────┬─────────┘
                           │
                    ┌──────┴──────┐
                    │             │
                  Valid         Invalid
                    │             │
                    ▼             ▼
          ┌────────────────┐  ┌───────────────┐
          │ Record Vote on │  │ Reject Vote   │
          │  Blockchain    │  │               │
          └───────┬────────┘  └───────────────┘
                  │
                  ▼
          ┌──────────────────┐
          │ Update Vote Count│
          └────────┬─────────┘
                   │
                   ▼
          ┌──────────────────┐
          │ Display Results  │
          └──────────────────┘
```

------------------------------------------------------------------------

## 🏗️ System Architecture

The application consists of three main layers:

``` text
┌─────────────────────────────────────────────┐
│              Frontend Application           │
│             HTML / CSS / JavaScript         │
└──────────────────────┬──────────────────────┘
                       │
                       │ Ethers.js
                       ▼
┌─────────────────────────────────────────────┐
│                  MetaMask                   │
│             User Wallet Connection           │
└──────────────────────┬──────────────────────┘
                       │
                       │ Blockchain Transaction
                       ▼
┌─────────────────────────────────────────────┐
│              Ethereum Network               │
│                                             │
│        ┌──────────────────────────┐         │
│        │    Solidity Smart        │         │
│        │        Contract          │         │
│        └──────────────────────────┘         │
│                                             │
│        Voting Records & Results             │
└─────────────────────────────────────────────┘
```

### Architecture Components

1.  **Frontend Application**
    -   Provides the user interface.
    -   Allows administrators and voters to interact with the system.
    -   Uses HTML, CSS, and JavaScript.
2.  **MetaMask**
    -   Connects the user's blockchain wallet to the application.
    -   Approves and submits blockchain transactions.
3.  **Ethers.js**
    -   Provides communication between the frontend and the smart
        contract.
4.  **Ethereum Network**
    -   Hosts the Solidity smart contract.
    -   Stores voting transactions and vote-related state.
5.  **Solidity Smart Contract**
    -   Applies voting rules.
    -   Validates voter eligibility.
    -   Prevents duplicate voting.
    -   Records votes and maintains vote counts.

------------------------------------------------------------------------

## 🛠️ Technology Stack

  Technology       Purpose
  ---------------- ----------------------------------------------
  **Solidity**     Smart contract development
  **Ethereum**     Blockchain platform
  **MetaMask**     Digital wallet and transaction authorization
  **Ethers.js**    Frontend-to-smart-contract communication
  **HTML**         Web page structure
  **CSS**          User interface styling
  **JavaScript**   Frontend functionality

------------------------------------------------------------------------

## 📋 Functional Requirements

### Administrator Requirements

1.  The administrator must be able to create an election.
2.  The administrator must be able to add candidates.
3.  The administrator must be able to register voters.
4.  The administrator must be able to start and end an election.
5.  The administrator must be able to view election results.
6.  Administrative functions must be restricted to the authorized
    administrator.

### Voter Requirements

1.  A voter must connect a valid MetaMask wallet.
2.  The voter must be registered before voting.
3.  The voter must be able to view available candidates.
4.  The voter must be able to cast a vote.
5.  A voter must not be able to vote more than once.
6.  The voter should receive confirmation after a successful blockchain
    transaction.
7.  Voting must only be possible while the election is active.

### Smart Contract Requirements

1.  Store candidate information.
2.  Store registered voter addresses.
3.  Track whether a voter has already voted.
4.  Record votes on the blockchain.
5.  Maintain candidate vote counts.
6.  Provide functions for retrieving election results.
7.  Restrict administrative operations to the authorized administrator.
8.  Validate the election state before accepting votes.

------------------------------------------------------------------------

## 🔐 Voting Logic

Before accepting a vote, the smart contract validates the voting
conditions.

``` text
User connects MetaMask
          │
          ▼
   Is wallet registered?
       │           │
      No          Yes
       │           │
    Reject         ▼
             Already voted?
              │       │
             Yes      No
              │       │
            Reject     ▼
                 Election active?
                  │        │
                 No       Yes
                  │        │
                Reject     ▼
                     Record Vote
                         │
                         ▼
                   Update Vote Count
```

A simplified representation of the voter state is:

``` solidity
mapping(address => bool) public registeredVoters;
mapping(address => bool) public hasVoted;
```

Candidate vote counts can also be stored and updated by the smart
contract.

------------------------------------------------------------------------

## 🚀 System Operation

### 1. Election Creation
The administrator creates an election and provides the required election
information.

### 2. Candidate Registration
The administrator adds candidates who will participate in the election.

### 3. Voter Registration
Eligible voters are registered using their blockchain wallet addresses.

### 4. Wallet Connection
A voter opens the application and connects their MetaMask wallet.

### 5. Voter Verification
The smart contract checks whether:

-   The wallet is registered.
-   The voter has not already voted.
-   The election is currently active.

### 6. Vote Submission
The voter selects a candidate and submits the vote.

MetaMask generates and authorizes the blockchain transaction.

### 7. Smart Contract Processing
The smart contract validates the vote and records it on the blockchain.

### 8. Results
After the election ends, the application retrieves vote counts from the
smart contract and displays the results.

------------------------------------------------------------------------

## 📁 Proposed Project Structure

``` text
blockchain-voting-system/
│
├── contracts/
│   └── Voting.sol
│
├── frontend/
│   ├── index.html
│   ├── admin.html
│   ├── voting.html
│   ├── results.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       ├── app.js
│       ├── admin.js
│       ├── voting.js
│       └── results.js
│
├── test/
│   └── Voting.test.js
│
├── README.md
└── package.json
```

> The final project structure may change during development depending on
> the selected development tools and framework.

------------------------------------------------------------------------

## ⚙️ Getting Started

The repository is intended to contain the implementation of the voting
application as development progresses.

### Prerequisites

The project requires the following environment/components:

-   A modern web browser
-   MetaMask browser wallet
-   An Ethereum-compatible development/test environment
-   Solidity development environment
-   Ethers.js
-   Node.js/npm if required by the selected development setup

### General Setup

1.  Clone the repository:

``` bash
git clone https://github.com/YOUR-USERNAME/blockchain-voting-system.git
cd blockchain-voting-system
```

2.  Install the project's dependencies according to the configured
    `package.json`.

3.  Compile and deploy the Solidity smart contract using the selected
    Ethereum development/test environment.

4.  Configure the frontend with the deployed smart contract address and
    ABI.

5.  Open the frontend application in a supported browser.

6.  Connect MetaMask using an appropriate development/test account.

7.  Register eligible voter wallet addresses through the administrator
    functionality.

8.  Create and start an election.

9.  Connect a registered voter wallet and cast a vote.

10. End the election and view the results.

> **Note:** Exact deployment commands depend on the Ethereum development
> framework and test network selected during implementation.

------------------------------------------------------------------------

## 🧪 Testing

Testing will verify that the voting system behaves correctly and that
the smart contract enforces the required voting rules.

### Core Test Cases

  -----------------------------------------------------------------------
  Test Case                           Expected Result
  ----------------------------------- -----------------------------------
  Registered voter casts a vote       Vote is accepted

  Unregistered voter attempts to vote Vote is rejected

  Voter attempts to vote twice        Second vote is rejected

  Valid vote is submitted             Vote count increases

  Invalid candidate is selected       Transaction is rejected

  Vote is submitted after election    Vote is rejected
  ends                                

  Non-administrator performs admin    Operation is rejected
  operation                           

  Smart contract function is called   Expected contract behavior occurs
  -----------------------------------------------------------------------

Testing will also cover the smart contract on the selected Ethereum test
environment.

------------------------------------------------------------------------

## 🔒 Security Considerations

Security is an important part of the project because voting operations
are handled through a blockchain smart contract.

The system will consider:

-   Smart contract access control
-   Voter eligibility verification
-   Prevention of duplicate voting
-   Candidate validation
-   Election state validation
-   Protection of administrative functions
-   Correct handling of blockchain transactions
-   Safe MetaMask integration
-   Avoiding exposure of private wallet credentials

### ⚠️ Never Share Private Keys

The application must never request or store a user's:

-   MetaMask seed phrase
-   Private key
-   Secret recovery phrase

Users should never share these credentials with the application or any
other person.

------------------------------------------------------------------------

## ⚠️ Scope and Limitations

This project is an **educational prototype** intended for university or
classroom elections.

It is **not designed to replace real-world government election
infrastructure**.

The project does not attempt to solve all requirements of a production
or national election system, including:

-   Government-level voter identity verification
-   Anonymous ballot secrecy
-   Large-scale election infrastructure
-   Coercion resistance
-   Comprehensive accessibility requirements
-   Legal and regulatory compliance
-   End-to-end election auditing at national scale

The primary purpose is to demonstrate blockchain, smart contracts,
wallets, decentralized applications, and blockchain-based record
keeping.

------------------------------------------------------------------------

## 🎯 Project Objectives

The main objectives are to:

-   Develop an online voting system using blockchain technology.
-   Develop and deploy a Solidity smart contract.
-   Record voting transactions on the blockchain.
-   Ensure that a registered voter can vote only once.
-   Allow an administrator to manage elections and candidates.
-   Allow administrators to register eligible voters.
-   Integrate MetaMask wallets.
-   Display election results clearly.
-   Understand the practical use of blockchain and smart contracts.
-   Gain practical experience developing a decentralized application
    (DApp).

------------------------------------------------------------------------

## 📊 Expected Outcome

At the completion of the project, the expected outcome is a working web
application capable of conducting a small-scale university or classroom
election.

The application should demonstrate:

-   ✅ Blockchain-based vote recording
-   ✅ Smart contract functionality
-   ✅ MetaMask wallet integration
-   ✅ Voter registration
-   ✅ One-person-one-vote enforcement at the smart-contract level
-   ✅ Transparent vote counting
-   ✅ Blockchain transaction verification
-   ✅ Election result display

------------------------------------------------------------------------

## 📚 Learning Goals

This project provides practical experience with:

-   Blockchain fundamentals
-   Ethereum transactions
-   Solidity programming
-   Smart contract development
-   Smart contract security concepts
-   MetaMask wallet integration
-   Ethers.js
-   Decentralized applications (DApps)
-   Frontend-to-blockchain communication
-   Blockchain-based data storage

------------------------------------------------------------------------

## 🔮 Future Improvements

Possible future improvements include:

-   Multiple elections
-   Election scheduling
-   Improved administrator dashboard
-   Improved user interface
-   Election event logging
-   Comprehensive smart contract testing and auditing
-   Deployment to an Ethereum-compatible test network
-   Role-based access control
-   Improved accessibility
-   Advanced result visualization
-   Support for multiple election types

------------------------------------------------------------------------

## 📌 Project Status

**Status:** 🚧 Proposed / In Development

This repository will contain the implementation of the
**Blockchain-Based Voting System** as development progresses.

------------------------------------------------------------------------

## 👥 Project Information

**Project:** Blockchain-Based Voting System\
**Type:** Educational Prototype\
**Domain:** Blockchain / Web Application / Decentralized Application\
**Target Environment:** University or Classroom Elections

------------------------------------------------------------------------

## 📄 License

This project is intended for educational purposes.

A specific open-source license can be added to the repository according
to the project's requirements.

------------------------------------------------------------------------

## ⭐ Conclusion

The **Blockchain-Based Voting System** demonstrates how blockchain
technology and smart contracts can be applied to a small-scale online
voting scenario.

By combining a web interface, MetaMask, Ethers.js, Ethereum, and
Solidity, the project provides a practical demonstration of:

-   Smart contracts
-   Blockchain transactions
-   Digital wallets
-   Decentralized applications
-   Blockchain-based record keeping

The project is designed primarily as a learning and demonstration
platform rather than a production election system.
