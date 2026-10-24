// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title UniversityVoting
/// @notice Educational voting contract with department-level eligibility.
contract UniversityVoting {
    address public admin;

    struct Election {
        string title;
        bytes32 departmentCode;
        uint256 endTime;
        bool exists;
        uint256 candidateCount;
    }

    struct Candidate {
        string name;
        uint256 voteCount;
    }

    uint256 public electionCount;

    mapping(uint256 => Election) public elections;
    mapping(uint256 => mapping(uint256 => Candidate)) public candidates;

    // The admin records the student's wallet and department.
    mapping(address => bytes32) public voterDepartment;
    mapping(address => bool) public voterRegistered;

    // A wallet can vote once per election.
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ElectionCreated(uint256 indexed electionId, string title, bytes32 departmentCode);
    event CandidateAdded(uint256 indexed electionId, uint256 indexed candidateId, string name);
    event VoterRegistered(address indexed voter, bytes32 departmentCode);
    event VoteCast(uint256 indexed electionId, address indexed voter, uint256 candidateId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createElection(
        string calldata title,
        bytes32 departmentCode,
        uint256 endTime
    ) external onlyAdmin {
        require(bytes(title).length > 0, "Election title is required");
        require(departmentCode != bytes32(0), "Department is required");
        require(endTime > block.timestamp, "End time must be in the future");

        electionCount++;
        elections[electionCount] = Election({
            title: title,
            departmentCode: departmentCode,
            endTime: endTime,
            exists: true,
            candidateCount: 0
        });

        emit ElectionCreated(electionCount, title, departmentCode);
    }

    function addCandidate(uint256 electionId, string calldata name) external onlyAdmin {
        Election storage election = elections[electionId];
        require(election.exists, "Election does not exist");
        require(block.timestamp < election.endTime, "Election has ended");
        require(bytes(name).length > 0, "Candidate name is required");

        election.candidateCount++;
        candidates[electionId][election.candidateCount] = Candidate({
            name: name,
            voteCount: 0
        });

        emit CandidateAdded(electionId, election.candidateCount, name);
    }

    function registerVoter(address voter, bytes32 departmentCode) external onlyAdmin {
        require(voter != address(0), "Invalid wallet address");
        require(departmentCode != bytes32(0), "Department is required");

        voterRegistered[voter] = true;
        voterDepartment[voter] = departmentCode;
        emit VoterRegistered(voter, departmentCode);
    }

    function vote(uint256 electionId, uint256 candidateId) external {
        Election storage election = elections[electionId];

        require(election.exists, "Election does not exist");
        require(block.timestamp < election.endTime, "Election has ended");
        require(voterRegistered[msg.sender], "Wallet is not registered");
        require(
            voterDepartment[msg.sender] == election.departmentCode,
            "Your department is not eligible for this election"
        );
        require(!hasVoted[electionId][msg.sender], "You have already voted");
        require(candidateId > 0 && candidateId <= election.candidateCount, "Invalid candidate");

        hasVoted[electionId][msg.sender] = true;
        candidates[electionId][candidateId].voteCount++;

        emit VoteCast(electionId, msg.sender, candidateId);
    }

    function getElection(uint256 electionId)
        external
        view
        returns (string memory title, bytes32 departmentCode, uint256 endTime, uint256 candidateCount, bool exists)
    {
        Election storage election = elections[electionId];
        return (
            election.title,
            election.departmentCode,
            election.endTime,
            election.candidateCount,
            election.exists
        );
    }

    function getCandidate(uint256 electionId, uint256 candidateId)
        external
        view
        returns (string memory name, uint256 voteCount)
    {
        Candidate storage candidate = candidates[electionId][candidateId];
        return (candidate.name, candidate.voteCount);
    }
}
