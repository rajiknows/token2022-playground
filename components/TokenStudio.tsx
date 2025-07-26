"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, Transaction } from "@solana/web3.js";
import { TokenExtensions } from "../services/token-extensions";

export default function TokenStudio() {
  const { connection, publicKey, sendTransaction } = useWallet();
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [decimals, setDecimals] = useState(9);
  const [mintAmount, setMintAmount] = useState(1000);
  const [selectedSprite, setSelectedSprite] = useState("");
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");

  const sprites = [
    "/sprites/sprite1.svg",
    "/sprites/sprite2.svg",
    "/sprites/sprite3.svg",
    "/sprites/sprite4.svg",
    "/sprites/sprite5.svg",
  ];

  const extensions = [
    "Mint Close Authority",
    "Reallocate",
    "Pausable",
    "Transfer Fee",
    "Transfer Hook",
    "Required Memo on Transfer",
    "Non-Transferable Tokens",
    "Immutable Owner",
    "Permanent Delegate",
    "CPI Guard",
    "Default Account State",
    "Metadata Pointer",
    "Token Metadata",
    "Group Pointer",
    "Group",
    "Member Pointer",
    "Member",
    "Interest-Bearing Tokens",
    "Scaled UI Amount",
  ];

  const handleExtensionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { options } = e.target;
    const value: string[] = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setSelectedExtensions(value);
  };

  const handleCreateToken = async () => {
    if (!publicKey) {
      setError("Wallet not connected");
      return;
    }

    setIsLoading(true);
    setError("");
    setSignature("");

    try {
      const tokenExtensions = new TokenExtensions(publicKey, connection);
      const mintKeypair = Keypair.generate();

      const transaction = new Transaction();

      for (const extension of selectedExtensions) {
        switch (extension) {
          case "Mint Close Authority":
            transaction.add(tokenExtensions.createMintCloseAuthorityInstruction());
            break;
          case "Reallocate":
            transaction.add(tokenExtensions.createReallocateInstruction());
            break;
          case "Pausable":
            transaction.add(tokenExtensions.createPausableInstruction());
            break;
          case "Transfer Fee":
            transaction.add(tokenExtensions.createTransferFeeInstruction());
            break;
          case "Transfer Hook":
            transaction.add(tokenExtensions.createTransferHookInstruction());
            break;
          case "Required Memo on Transfer":
            transaction.add(tokenExtensions.createRequiredMemoOnTransferInstruction());
            break;
          case "Non-Transferable Tokens":
            transaction.add(tokenExtensions.createNonTransferableTokensInstruction());
            break;
          case "Immutable Owner":
            transaction.add(tokenExtensions.createImmutableOwnerInstruction());
            break;
          case "Permanent Delegate":
            transaction.add(tokenExtensions.createPermanentDelegateInstruction());
            break;
          case "CPI Guard":
            transaction.add(tokenExtensions.createCpiGuardInstruction());
            break;
          case "Default Account State":
            transaction.add(tokenExtensions.createDefaultAccountStateInstruction());
            break;
          case "Metadata Pointer":
            transaction.add(tokenExtensions.createMetadataPointerInstruction());
            break;
          case "Token Metadata":
            transaction.add(tokenExtensions.createTokenMetadataInstruction());
            break;
          case "Group Pointer":
            transaction.add(tokenExtensions.createGroupPointerInstruction());
            break;
          case "Group":
            transaction.add(tokenExtensions.createGroupInstruction());
            break;
          case "Member Pointer":
            transaction.add(tokenExtensions.createMemberPointerInstruction());
            break;
          case "Member":
            transaction.add(tokenExtensions.createMemberInstruction());
            break;
          case "Interest-Bearing Tokens":
            transaction.add(tokenExtensions.createInterestBearingTokensInstruction());
            break;
          case "Scaled UI Amount":
            transaction.add(tokenExtensions.createScaledUiAmountInstruction());
            break;
        }
      }

      const sig = await sendTransaction(transaction, connection, { signers: [mintKeypair] });
      await connection.confirmTransaction(sig, "confirmed");
      setSignature(sig);
    } catch (err: any) {
      setError(err.message || "Failed to create token");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{borderRadius: '20px', backgroundColor: '#e0e5ec', boxShadow: '9px 9px 16px #a3b1c6, -9px -9px 16px #ffffff'}} className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Token Studio</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="tokenName" className="block text-sm font-medium text-gray-700">Token Name</label>
          <input
            type="text"
            id="tokenName"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            placeholder="e.g., My Awesome Token"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            style={{borderRadius: '10px', backgroundColor: '#e0e5ec', boxShadow: 'inset 5px 5px 10px #a3b1c6, inset -5px -5px 10px #ffffff'}}
          />
        </div>
        <div>
          <label htmlFor="tokenSymbol" className="block text-sm font-medium text-gray-700">Token Symbol</label>
          <input
            type="text"
            id="tokenSymbol"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            placeholder="e.g., MAT"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            style={{borderRadius: '10px', backgroundColor: '#e0e5ec', boxShadow: 'inset 5px 5px 10px #a3b1c6, inset -5px -5px 10px #ffffff'}}
          />
        </div>
        <div>
          <label htmlFor="decimals" className="block text-sm font-medium text-gray-700">Decimals</label>
          <input
            type="number"
            id="decimals"
            value={decimals}
            onChange={(e) => setDecimals(parseInt(e.target.value))}
            placeholder="e.g., 9"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            style={{borderRadius: '10px', backgroundColor: '#e0e5ec', boxShadow: 'inset 5px 5px 10px #a3b1c6, inset -5px -5px 10px #ffffff'}}
          />
        </div>
        <div>
          <label htmlFor="mintAmount" className="block text-sm font-medium text-gray-700">Amount to Mint</label>
          <input
            type="number"
            id="mintAmount"
            value={mintAmount}
            onChange={(e) => setMintAmount(parseInt(e.target.value))}
            placeholder="e.g., 1000"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            style={{borderRadius: '10px', backgroundColor: '#e0e5ec', boxShadow: 'inset 5px 5px 10px #a3b1c6, inset -5px -5px 10px #ffffff'}}
          />
        </div>
        <div>
          <label htmlFor="extensions" className="block text-sm font-medium text-gray-700">Token Extensions</label>
          <select
            id="extensions"
            multiple
            value={selectedExtensions}
            onChange={handleExtensionChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            style={{borderRadius: '10px', backgroundColor: '#e0e5ec', boxShadow: 'inset 5px 5px 10px #a3b1c6, inset -5px -5px 10px #ffffff'}}
          >
            {extensions.map((ext) => (
              <option key={ext} value={ext}>{
                ext
              }</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Choose a Sprite</label>
          <div className="mt-2 grid grid-cols-5 gap-4">
            {sprites.map((sprite) => (
              <img
                key={sprite}
                src={sprite}
                alt={sprite}
                className={`w-16 h-16 rounded-full cursor-pointer ${selectedSprite === sprite ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedSprite(sprite)}
              />
            ))}
          </div>
        </div>
        <button
          className="w-full text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          style={{backgroundColor: '#4a90e2', boxShadow: '9px 9px 16px #a3b1c6, -9px -9px 16px #ffffff'}}
          onClick={handleCreateToken}
          disabled={isLoading || !publicKey}
        >
          {isLoading ? "Creating Token..." : "Create Token"}
        </button>

        {signature && (
          <div className="mt-4 p-4 rounded-md" style={{backgroundColor: '#e0e5ec', boxShadow: '9px 9px 16px #a3b1c6, -9px -9px 16px #ffffff'}}>
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> Transaction Signature:</span>
            <a
              href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
              target="_blank"
              rel="noreferrer"
              className="ml-2 font-medium text-blue-600 hover:text-blue-800 break-all"
            >
              {signature}
            </a>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 rounded-md" style={{backgroundColor: '#e0e5ec', boxShadow: '9px 9px 16px #a3b1c6, -9px -9px 16px #ffffff'}}>
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
      </div>
    </div>
  );
}