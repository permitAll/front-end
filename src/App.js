import logo from "./logo.svg";
import "./App.css";

import React, { useState, useEffect } from "react";
import { useMetaMask } from "metamask-react";
import { ethers } from "ethers";

import FactoryJSON from "./Factory.json";
import RecoveryJSON from "./Recovery.json";

const FACTORY_CONTRACT_ADDRESS = "0xC33331282FDE8edBF4911e4D12dFF66c02687457";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const factoryContract = new ethers.Contract(
  FACTORY_CONTRACT_ADDRESS,
  FactoryJSON.abi,
  provider
);

function App() {
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  function deployContract() {
    const signer = provider.getSigner();
    try {
      factoryContract
        .connect(signer)
        .createRecoveryContract(
          ethers.utils.keccak256(ethers.utils.toUtf8Bytes(password))
        );
    } catch (err) {
      console.log(err);
    }
  }

  async function commitRecovery() {
    const signer = provider.getSigner();
    const recoveryContractAddress = await factoryContract
      .connect(signer)
      .recoveryContracts(account);

    const recoveryContract = new ethers.Contract(
      recoveryContractAddress,
      RecoveryJSON.abi,
      provider
    );

    try {
      recoveryContract
        .connect(signer)
        .commitLockHash(
          ethers.utils.solidityKeccak256(
            ["string", "address"],
            [passwordCommit, recipient]
          )
        );
    } catch (err) {
      console.log(err);
    }
  }

  async function claimOwnership() {
    const signer = provider.getSigner();
    const recoveryContractAddress = await factoryContract
      .connect(signer)
      .recoveryContracts(account);

    const recoveryContract = new ethers.Contract(
      recoveryContractAddress,
      RecoveryJSON.abi,
      provider
    );

    try {
      recoveryContract.connect(signer).claimOwnership(passwordClaim, account);
    } catch (err) {
      console.log(err);
    }
  }

  function loadMetamask() {
    if (status === "initializing")
      return <div>Synchronisation with MetaMask ongoing...</div>;

    if (status === "unavailable") return <div>MetaMask not available :(</div>;

    if (status === "notConnected")
      return <button onClick={connect}>Connect to MetaMask</button>;

    if (status === "connecting") return <div>Connecting...</div>;

    if (status === "connected")
      return (
        <div>
          Connected account {account} on chain ID {chainId}
        </div>
      );

    return null;
  }
  const [page, setPage] = useState("home");
  const [password, setPassword] = useState("");
  const [recipient, setRecipient] = useState("");
  const [passwordCommit, setPasswordCommit] = useState("");
  const [passwordClaim, setPasswordClaim] = useState("");

  const pages = {
    home: (
      <div>
        <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-center text-indigo-600 sm:text-3xl">
              Initialize Recovery Contract
            </h1>

            <p className="max-w-md mx-auto mt-4 text-center text-gray-500">
              Deploy a recovery contract for your wallet address so that in case
              of tragic event, a trusted member can retrieve all of your funds.
              Please set up a secret password that can be used to access your
              funds.
            </p>

            <div className="p-8 mt-6 mb-0 space-y-4 rounded-lg shadow-2xl">
              <p className="text-lg font-medium">
                Set up password and deploy contract
              </p>

              <div>
                <div className="relative mt-1">
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    id="password"
                    className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                    placeholder="Enter password"
                  />

                  <span className="absolute inset-y-0 inline-flex items-center right-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              <button
                // type="submit"
                className="block w-full px-5 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg"
                onClick={() => deployContract()}
              >
                Deploy Contract
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
    allowance: (
      <div>
        <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-center text-indigo-600 sm:text-3xl">
              Setup Allowances
            </h1>

            {/* <p className="max-w-md mx-auto mt-4 text-center text-gray-500">
              Set allowance of your tokens to the recovery address.
            </p> */}

            <div className="p-8 mt-6 mb-0 space-y-4 rounded-lg shadow-2xl">
              <p className="text-lg font-medium">
                Set up allowances for your ERC-20 and ERC-721
              </p>

              <div>100 USDC</div>
              <div>50 COMP</div>

              <button
                type="submit"
                className="block w-full px-5 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg"
              >
                Setup Allowances
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
    commit: (
      <div>
        <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-center text-indigo-600 sm:text-3xl">
              Commit
            </h1>

            <p className="max-w-md mx-auto mt-4 text-center text-gray-500">
              Set allowance of your tokens to the recovery address.
            </p>

            <div className="p-8 mt-6 mb-0 space-y-4 rounded-lg shadow-2xl">
              <p className="text-lg font-medium">
                Use your secret password to commit a recovery ahead of time to
                prevent MEV front-running. A hash is generated based on your
                password and wallet address.
              </p>
              {/* <div>
                Hash:
                {recipient === ""
                  ? "-"
                  : ethers.utils.solidityKeccak256(
                      ["string", "address"],
                      [passwordCommit, recipient]
                    )}
              </div> */}
              <div class="relative mt-1">
                <input
                  type="text"
                  id="text"
                  class="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                  placeholder="Enter recipient"
                  value={recipient}
                  onChange={(event) => setRecipient(event.target.value)}
                />
              </div>
              <div>
                <div className="relative mt-1">
                  <input
                    type="password"
                    id="password"
                    className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                    placeholder="Enter password"
                    value={passwordCommit}
                    onChange={(event) => setPasswordCommit(event.target.value)}
                  />

                  <span className="absolute inset-y-0 inline-flex items-center right-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <button
                type="submit"
                className="block w-full px-5 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg"
                onClick={() => commitRecovery()}
              >
                Commit Recovery
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
    recovery: (
      <div>
        <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-center text-indigo-600 sm:text-3xl">
              Recovery
            </h1>

            <p className="max-w-md mx-auto mt-4 text-center text-gray-500">
              Set allowance of your tokens to the recovery address.
            </p>

            <div className="p-8 mt-6 mb-0 space-y-4 rounded-lg shadow-2xl">
              <p className="text-lg font-medium">
                Set up allowances for your ERC-20 and ERC-721
              </p>

              <div>
                <div className="relative mt-1">
                  <input
                    type="password"
                    id="password"
                    value={passwordClaim}
                    onChange={(event) => setPasswordClaim(event.target.value)}
                    className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                    placeholder="Enter password"
                  />

                  <span className="absolute inset-y-0 inline-flex items-center right-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="block w-full px-5 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg"
                onClick={() => claimOwnership()}
              >
                Claim contract ownership
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div className="App">
      {loadMetamask()}
      <div className="flex justify-center flex-row w-full">
        <div
          className="cursor-pointer inline-block px-12 py-3 text-sm font-medium text-white bg-gray-600 border border-gray-600 rounded active:text-gray-500 hover:bg-transparent hover:text-gray-600 focus:outline-none focus:ring m-4"
          onClick={() => setPage("home")}
        >
          Initialize Contract
        </div>
        <div
          className="cursor-pointer inline-block px-12 py-3 text-sm font-medium text-white bg-gray-600 border border-gray-600 rounded active:text-gray-500 hover:bg-transparent hover:text-gray-600 focus:outline-none focus:ring m-4"
          onClick={() => setPage("allowance")}
        >
          Set up allowances
        </div>
        <div
          className="cursor-pointer inline-block px-12 py-3 text-sm font-medium text-white bg-gray-600 border border-gray-600 rounded active:text-gray-500 hover:bg-transparent hover:text-gray-600 focus:outline-none focus:ring m-4"
          onClick={() => setPage("commit")}
        >
          Commit
        </div>
        <div
          className="cursor-pointer inline-block px-12 py-3 text-sm font-medium text-white bg-gray-600 border border-gray-600 rounded active:text-gray-500 hover:bg-transparent hover:text-gray-600 focus:outline-none focus:ring m-4"
          onClick={() => setPage("recovery")}
        >
          Recovery
        </div>
      </div>
      {pages[page]}
    </div>
  );
}

export default App;
