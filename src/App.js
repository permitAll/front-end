import logo from "./logo.svg";
import "./App.css";

import React, { useState, useEffect } from "react";
import { useMetaMask } from "metamask-react";
import { ethers } from "ethers";

// TODO: add the SwapJSON
// import SwapJSON from "./SwapJSON.json";

function App() {
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const [inputAmount, setInputAmount] = useState();
  const [outputAmount, setOutputAmount] = useState();

  function swapToken() {
    // triggers the swapping
  }

  useEffect(() => {
    const signTypedDataV4Button = document.getElementById(
      "signTypedDataV4Button"
    );
    signTypedDataV4Button.addEventListener("click", function (event) {
      event.preventDefault();

      const msgParams = JSON.stringify({
        domain: {
          chainId: chainId,
          name: "ERC20PermitEverywhere",
          verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
          version: "1.0.0",
        },
        message: {
          // erc20
          token: "0x5962DF0fB181a089476C58eDb29ee7960fF53794",
          // uniswap
          spender: "0x5962DF0fB181a089476C58eDb29ee7960fF53794",
          maxAmount: "100000",
          deadline: "1000000000",
          nonce: "5",
        },
        primaryType: "PermitTransferFrom",
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
          PermitTransferFrom: [
            { name: "token", type: "address" },
            { name: "spender", type: "address" },
            { name: "maxAmount", type: "uint256" },
            { name: "deadline", type: "uint256" },
            { name: "nonce", type: "uint256" },
          ],
        },
      });

      var from = window.ethereum.accounts[0];

      var params = [from, msgParams];
      var method = "eth_signTypedData_v4";

      window.ethereum.sendAsync({
        method,
        params,
        from,
      });
    });
  }, []);

  const chainIDs = {
    "0x1": "Ethereum",
    "0x4": "Rinkeby",
    "0x89": "Polygon",
    "0xa": "Optimism",
  };

  function loadMetamask() {
    if (status === "initializing")
      return <div>Synchronisation with MetaMask ongoing...</div>;

    if (status === "unavailable") return <div>MetaMask not available :(</div>;

    if (status === "notConnected")
      return <button onClick={connect}>Connect to MetaMask</button>;

    if (status === "connecting") return <div>Connecting...</div>;

    if (status === "connected")
      return (
        <div className="mx-2 my-2">
          Connected to{" "}
          <span className="text-indigo-600 font-bold">{chainIDs[chainId]}</span>
        </div>
      );

    return null;
  }

  return (
    <div>
      <div> {loadMetamask()}</div>
      <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-center text-indigo-600 sm:text-3xl">
            Poopiswap
          </h1>

          <p className="max-w-md mx-auto mt-4 text-center text-gray-500">
            Permit Everywhere is a public good that allows protocols to securely
            move any token on user’s behalf without having to grant the protocol
            an allowance.
          </p>

          <div className="p-8 mt-6 mb-0 space-y-4 rounded-lg shadow-2xl">
            <p className="text-lg font-medium">Swap</p>

            <label className="text-sm font-medium">From</label>
            <div>
              <div className="relative mt-1">
                <div className="flex flex-row justify-center items-center">
                  <input
                    type="value"
                    value={inputAmount}
                    onChange={(event) => setInputAmount(event.target.value)}
                    id="value"
                    className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                    placeholder="Enter amount"
                  />
                  <img src="./ethereum-eth-logo.svg" className="w-8 h-8"></img>
                </div>
              </div>
            </div>

            <label className="text-sm font-medium">To</label>
            <div>
              <div className="relative mt-1">
                <div className="flex flex-row justify-center items-center">
                  <input
                    type="value"
                    value={inputAmount * 3213}
                    // onChange={}
                    id="value"
                    className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                    placeholder="Enter amount"
                  />
                  <img
                    src="./terra-luna-luna-logo.svg"
                    className="pl-1 w-8 h-8"
                  ></img>
                </div>
              </div>
            </div>

            <button
              className="block w-full px-5 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg"
              onClick={() => swapToken()}
              id="signTypedDataV4Button"
            >
              One Click Swap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
