// UniversityVoting frontend
// Make sure this address matches your deployed contract.
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const ABI = [
  "function admin() view returns (address)",
  "function electionCount() view returns (uint256)",
  "function elections(uint256) view returns (string title, bytes32 departmentCode, uint256 endTime, bool exists, uint256 candidateCount)",
  "function getElection(uint256) view returns (string title, bytes32 departmentCode, uint256 endTime, uint256 candidateCount, bool exists)",
  "function getCandidate(uint256,uint256) view returns (string name,uint256 voteCount)",
  "function createElection(string,bytes32,uint256)",
  "function addCandidate(uint256,string)",
  "function registerVoter(address,bytes32)",
  "function voterRegistered(address) view returns (bool)",
  "function voterDepartment(address) view returns (bytes32)",
  "function hasVoted(uint256,address) view returns (bool)",
  "function vote(uint256,uint256)"
];

let provider;
let signer;
let contract;
let currentAccount = "";
let electionsCache = [];

const $ = (id) => document.getElementById(id);

function showNotice(message, isError = false) {
  const notice = $("notice");
  if (!notice) return;

  notice.textContent = message;
  notice.className = isError ? "notice error" : "notice";
}

function clearNotice() {
  const notice = $("notice");
  if (notice) notice.className = "notice hidden";
}

function departmentBytes(code) {
  const clean = code.trim().toUpperCase();

  if (!clean) {
    throw new Error("Please enter a department code.");
  }

  try {
    return ethers.encodeBytes32String(clean);
  } catch {
    throw new Error(
      "Department code is too long. Use a short code of at most 31 UTF-8 bytes."
    );
  }
}

function departmentText(value) {
  try {
    return ethers.decodeBytes32String(value);
  } catch {
    return "Unknown";
  }
}

function localDateTime(timestamp) {
  return new Date(Number(timestamp) * 1000).toLocaleString();
}

function shorten(address) {
  return address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function readableError(error) {
  const message =
    error?.shortMessage ||
    error?.reason ||
    error?.message ||
    "Something went wrong.";

  if (message.includes("Only admin")) {
    return "Admin-only action: connect the wallet that deployed the contract.";
  }

  if (message.includes("department is not eligible")) {
    return "Vote rejected: your registered department is not eligible for this election.";
  }

  if (message.includes("already voted")) {
    return "Vote rejected: this wallet has already voted in this election.";
  }

  if (message.includes("not registered")) {
    return "Vote rejected: this wallet is not registered by the administrator.";
  }

  if (message.includes("Election has ended")) {
    return "This election has ended.";
  }

  if (
    message.includes("could not decode result data") ||
    message.includes("BAD_DATA")
  ) {
    return "Could not read the contract. Check the contract address, network, deployment, and ABI.";
  }

  if (
    message.includes("user rejected") ||
    message.includes("ACTION_REJECTED")
  ) {
    return "Transaction cancelled in MetaMask.";
  }

  return message.length > 220
    ? message.slice(0, 220) + "..."
    : message;
}

// Connect MetaMask and initialize the contract.
async function connectWallet() {
  clearNotice();

  if (!window.ethereum) {
    showNotice(
      "MetaMask was not found. Install the MetaMask browser extension first.",
      true
    );
    return;
  }

  if (
    !ethers.isAddress(CONTRACT_ADDRESS) ||
    CONTRACT_ADDRESS === "PASTE_DEPLOYED_CONTRACT_ADDRESS_HERE"
  ) {
    showNotice(
      "Please configure a valid deployed contract address.",
      true
    );
    return;
  }

  try {
    await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    currentAccount = await signer.getAddress();

    // Connect to the configured contract.
    contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ABI,
      signer
    );

    // Verify that the contract is deployed at this address.
    const code = await provider.getCode(CONTRACT_ADDRESS);

    if (code === "0x") {
      contract = null;

      showNotice(
        "No contract was found at this address on the selected network. Check your Hardhat deployment and MetaMask network.",
        true
      );
      return;
    }

    if ($("connectButton")) {
      $("connectButton").textContent = shorten(currentAccount);
    }

    if ($("connectionStatus")) {
      $("connectionStatus").textContent =
        `Connected: ${shorten(currentAccount)}`;
    }

    const statusDot = document.querySelector(".status-dot");

    if (statusDot) {
      statusDot.style.background = "#16805d";
    }

    await refreshAll();

  } catch (error) {
    showNotice(readableError(error), true);
  }
}

// Load all elections and update the interface.
async function refreshAll() {
  if (!contract) return;

  clearNotice();

  try {
    const count = Number(await contract.electionCount());

    electionsCache = [];

    for (let id = 1; id <= count; id++) {
      const data = await contract.getElection(id);

      electionsCache.push({
        id,
        title: data[0],
        department: departmentText(data[1]),
        endTime: Number(data[2]),
        candidateCount: Number(data[3]),
        exists: data[4]
      });
    }

    renderElections();
    fillElectionSelects();

    if (electionsCache.length > 0) {
      const selectedId =
        $("resultsElection")?.value ||
        String(electionsCache[0].id);

      if ($("resultsElection")) {
        $("resultsElection").value = selectedId;
      }

      await loadResults(Number(selectedId));
    } else {
      if ($("resultsArea")) {
        $("resultsArea").className = "empty-state";
        $("resultsArea").textContent =
          "No elections have been created yet.";
      }

      if ($("analysisArea")) {
        $("analysisArea").textContent =
          "Create an election and add candidates to generate analysis.";
      }
    }

    // Refresh candidates for the currently selected voting election.
    if ($("voteElection")?.value) {
      await loadCandidates(Number($("voteElection").value));
    }

  } catch (error) {
    showNotice(readableError(error), true);
  }
}

// Display elections.
function renderElections() {
  const list = $("electionList");
  if (!list) return;

  if (electionsCache.length === 0) {
    list.className = "empty-state";
    list.textContent =
      "No elections found. An administrator can create the first election.";
    return;
  }

  list.className = "";

  list.innerHTML = electionsCache.map((election) => {
    const ended = Date.now() >= election.endTime * 1000;

    return `
      <div class="election-card">
        <div class="election-title">
          ${escapeHtml(election.title)}
          <span class="badge ${ended ? "ended" : ""}">
            ${ended ? "Ended" : "Open"}
          </span>
        </div>

        <div class="muted small">
          Election #${election.id} · Eligible department:
          <strong>${escapeHtml(election.department)}</strong>
        </div>

        <div class="muted tiny">
          Ends: ${escapeHtml(localDateTime(election.endTime))}
          · Candidates: ${election.candidateCount}
        </div>
      </div>
    `;
  }).join("");
}

// Populate election dropdowns.
function fillElectionSelects() {
  const selectIds = [
    "voteElection",
    "adminElection",
    "resultsElection"
  ];

  for (const id of selectIds) {
    const select = $(id);
    if (!select) continue;

    const oldValue = select.value;

    select.innerHTML =
      '<option value="">Select an election</option>' +
      electionsCache.map((election) => `
        <option value="${election.id}">
          ${escapeHtml(
            `#${election.id} — ${election.title} (${election.department})`
          )}
        </option>
      `).join("");

    if (
      electionsCache.some(
        (election) => String(election.id) === oldValue
      )
    ) {
      select.value = oldValue;
    }
  }
}

// Load candidates for the selected election.
async function loadCandidates(electionId) {
  const select = $("candidateSelect");

  if (select) {
    select.innerHTML =
      '<option value="">Select a candidate</option>';
  }

  if (!contract || !electionId) return [];

  const election = electionsCache.find(
    (item) => item.id === Number(electionId)
  );

  if (!election) return [];

  const candidates = [];

  for (
    let id = 1;
    id <= election.candidateCount;
    id++
  ) {
    const candidate = await contract.getCandidate(
      electionId,
      id
    );

    const item = {
      id,
      name: candidate[0],
      votes: Number(candidate[1])
    };

    candidates.push(item);

    if (select) {
      const option = document.createElement("option");
      option.value = String(id);
      option.textContent = item.name;
      select.appendChild(option);
    }
  }

  return candidates;
}

// Load election results.
async function loadResults(electionId) {
  if (!contract || !electionId) return;

  try {
    const election = electionsCache.find(
      (item) => item.id === Number(electionId)
    );

    if (!election) return;

    const candidates = [];
    let totalVotes = 0;

    for (
      let id = 1;
      id <= election.candidateCount;
      id++
    ) {
      const item = await contract.getCandidate(
        electionId,
        id
      );

      const candidate = {
        id,
        name: item[0],
        votes: Number(item[1])
      };

      candidates.push(candidate);
      totalVotes += candidate.votes;
    }

    if (candidates.length === 0) {
      if ($("resultsArea")) {
        $("resultsArea").className = "empty-state";
        $("resultsArea").textContent =
          "No candidates have been added to this election yet.";
      }

      if ($("analysisArea")) {
        $("analysisArea").textContent =
          "Add candidates and collect votes to generate analysis.";
      }

      return;
    }

    const ranked = [...candidates].sort(
      (a, b) => b.votes - a.votes
    );

    if ($("resultsArea")) {
      $("resultsArea").className = "";

      $("resultsArea").innerHTML =
        `<p class="muted small">
          ${escapeHtml(election.title)} ·
          ${totalVotes} vote(s) recorded
        </p>` +
        candidates.map((candidate) => {
          const share = totalVotes
            ? (candidate.votes / totalVotes) * 100
            : 0;

          return `
            <div class="result-row">
              <div class="result-top">
                <strong>${escapeHtml(candidate.name)}</strong>
                <span>
                  ${candidate.votes} vote(s) ·
                  ${share.toFixed(1)}%
                </span>
              </div>

              <div class="bar">
                <span style="width:${share}%"></span>
              </div>
            </div>
          `;
        }).join("");
    }

    renderAnalysis(
      election,
      candidates,
      totalVotes,
      ranked
    );

  } catch (error) {
    showNotice(readableError(error), true);
  }
}

// Generate a simple analysis of election results.
function renderAnalysis(
  election,
  candidates,
  totalVotes,
  ranked
) {
  const area = $("analysisArea");
  if (!area) return;

  const leader = ranked[0];
  const second = ranked[1];

  const share = totalVotes
    ? (leader.votes / totalVotes) * 100
    : 0;

  const margin = second
    ? leader.votes - second.votes
    : leader.votes;

  const tied =
    ranked.length > 1 &&
    ranked[0].votes === ranked[1].votes;

  const zeroCandidates = candidates.filter(
    (candidate) => candidate.votes === 0
  ).length;

  const lines = [];

  if (totalVotes === 0) {
    lines.push(
      "No votes have been recorded yet, so a leader cannot be identified."
    );
  } else if (tied) {
    lines.push(
      `The leading position is tied between candidates with ${leader.votes} vote(s).`
    );
  } else {
    lines.push(
      `${leader.name} is currently leading with ${leader.votes} vote(s) (${share.toFixed(1)}% of recorded votes).`
    );

    lines.push(
      `The lead over the next candidate is ${margin} vote(s).`
    );
  }

  lines.push(
    `A total of ${totalVotes} vote(s) have been recorded across ${candidates.length} candidate(s).`
  );

  if (zeroCandidates > 0) {
    lines.push(
      `${zeroCandidates} candidate(s) currently have no votes.`
    );
  }

  if (totalVotes > 0 && share >= 70 && !tied) {
    lines.push(
      "The current vote distribution is concentrated around the leading candidate."
    );
  } else if (totalVotes > 0 && share < 45) {
    lines.push(
      "The current result is competitive; no candidate has reached 45% of recorded votes."
    );
  }

  if (Date.now() < election.endTime * 1000) {
    lines.push(
      "The election is still open, so these results can change before the deadline."
    );
  } else {
    lines.push(
      "The election deadline has passed; these counts reflect the recorded blockchain votes."
    );
  }

  area.innerHTML =
    "<ul>" +
    lines.map(
      (line) => `<li>${escapeHtml(line)}</li>`
    ).join("") +
    "</ul>";
}

// Create an election. The contract must authorize the caller.
async function handleCreateElection(event) {
  event.preventDefault();

  if (!contract) {
    showNotice("Connect MetaMask first.", true);
    return;
  }

  try {
    const title = $("electionTitle").value.trim();
    const department = departmentBytes(
      $("departmentCode").value
    );

    const dateValue = $("endDate").value;
    const localDate = new Date(dateValue);
    const endTime = Math.floor(
      localDate.getTime() / 1000
    );

    if (
      !title ||
      !dateValue ||
      !Number.isFinite(endTime)
    ) {
      throw new Error(
        "Enter a valid election title and end date."
      );
    }

    if (endTime <= Math.floor(Date.now() / 1000)) {
      throw new Error(
        "The election end date must be in the future."
      );
    }

    const tx = await contract.createElection(
      title,
      department,
      endTime
    );

    showNotice(
      "Creating election. Confirm the transaction in MetaMask..."
    );

    await tx.wait();

    $("createElectionForm").reset();

    showNotice("Election created successfully.");
    await refreshAll();

  } catch (error) {
    showNotice(readableError(error), true);
  }
}

// Add a candidate to an election.
async function handleAddCandidate(event) {
  event.preventDefault();

  if (!contract) {
    showNotice("Connect MetaMask first.", true);
    return;
  }

  try {
    const electionId = Number(
      $("adminElection").value
    );

    const name = $("candidateName").value.trim();

    if (!electionId || !name) {
      throw new Error(
        "Select an election and enter a candidate name."
      );
    }

    const tx = await contract.addCandidate(
      electionId,
      name
    );

    showNotice(
      "Adding candidate. Confirm the transaction in MetaMask..."
    );

    await tx.wait();

    $("addCandidateForm").reset();

    showNotice("Candidate added successfully.");
    await refreshAll();

  } catch (error) {
    showNotice(readableError(error), true);
  }
}

// Register a voter. The caller must have admin permission.
async function handleRegisterVoter(event) {
  event.preventDefault();

  if (!contract) {
    showNotice("Connect MetaMask first.", true);
    return;
  }

  try {
    const address = $("voterAddress").value.trim();

    if (!ethers.isAddress(address)) {
      throw new Error(
        "Enter a valid wallet address."
      );
    }

    const department = departmentBytes(
      $("voterDepartment").value
    );

    const tx = await contract.registerVoter(
      address,
      department
    );

    showNotice(
      "Registering voter. Confirm the transaction in MetaMask..."
    );

    await tx.wait();

    $("registerVoterForm").reset();

    showNotice("Voter registered successfully.");

  } catch (error) {
    showNotice(readableError(error), true);
  }
}

// Submit a vote.
async function handleVote() {
  if (!contract) {
    showNotice("Connect MetaMask first.", true);
    return;
  }

  const electionId = Number(
    $("voteElection").value
  );

  const candidateId = Number(
    $("candidateSelect").value
  );

  if (!electionId || !candidateId) {
    showNotice(
      "Select an election and a candidate first.",
      true
    );
    return;
  }

  try {
    const tx = await contract.vote(
      electionId,
      candidateId
    );

    showNotice(
      "Submitting your vote. Confirm the transaction in MetaMask..."
    );

    await tx.wait();

    showNotice(
      "Your vote was recorded on the blockchain."
    );

    await refreshAll();

  } catch (error) {
    showNotice(readableError(error), true);
  }
}

// Register interface event listeners after the page loads.
function initializeApp() {
  const connectButton = $("connectButton");
  const refreshButton = $("refreshButton");
  const createForm = $("createElectionForm");
  const addCandidateForm = $("addCandidateForm");
  const registerForm = $("registerVoterForm");
  const voteButton = $("voteButton");
  const voteElection = $("voteElection");
  const resultsElection = $("resultsElection");

  if (connectButton) {
    connectButton.addEventListener(
      "click",
      connectWallet
    );
  }

  if (refreshButton) {
    refreshButton.addEventListener(
      "click",
      refreshAll
    );
  }

  if (createForm) {
    createForm.addEventListener(
      "submit",
      handleCreateElection
    );
  }

  if (addCandidateForm) {
    addCandidateForm.addEventListener(
      "submit",
      handleAddCandidate
    );
  }

  if (registerForm) {
    registerForm.addEventListener(
      "submit",
      handleRegisterVoter
    );
  }

  if (voteButton) {
    voteButton.addEventListener(
      "click",
      handleVote
    );
  }

  if (voteElection) {
    voteElection.addEventListener(
      "change",
      async (event) => {
        try {
          await loadCandidates(
            Number(event.target.value)
          );
        } catch (error) {
          showNotice(readableError(error), true);
        }
      }
    );
  }

  if (resultsElection) {
    resultsElection.addEventListener(
      "change",
      async (event) => {
        await loadResults(
          Number(event.target.value)
        );
      }
    );
  }

  if (window.ethereum) {
    window.ethereum.on(
      "accountsChanged",
      () => window.location.reload()
    );

    window.ethereum.on(
      "chainChanged",
      () => window.location.reload()
    );
  }
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeApp
  );
} else {
  initializeApp();
}
