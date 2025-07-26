"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useState, useEffect } from "react";

export default function TokenPlayground() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [tokens, setTokens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (publicKey) {
      setIsLoading(true);
      connection
        .getParsedTokenAccountsByOwner(publicKey, {
          programId: TOKEN_PROGRAM_ID,
        })
        .then(({ value }) => {
          const tokenAccounts = value.map((account) => {
            const { parsed, pubkey } = account.account.data;
            return {
              publicKey: pubkey.toBase58(),
              mint: parsed.info.mint,
              amount: parsed.info.tokenAmount.uiAmount,
              sprite: `/sprites/sprite${Math.floor(Math.random() * 5) + 1}.svg`
            };
          });
          setTokens(tokenAccounts);
          setIsLoading(false);
        });
    }
  }, [publicKey, connection]);

  const handleTokenClick = (e: any) => {
    e.currentTarget.classList.toggle('animate-bounce');
  }

  if (!publicKey) {
    return (
      <div style={{borderRadius: '20px', backgroundColor: '#e0e5ec', boxShadow: '9px 9px 16px #a3b1c6, -9px -9px 16px #ffffff'}} className="p-6 text-center">
        <p className="text-gray-500">Please connect your wallet to see your tokens.</p>
      </div>
    );
  }

  return (
    <div style={{borderRadius: '20px', backgroundColor: '#e0e5ec', boxShadow: '9px 9px 16px #a3b1c6, -9px -9px 16px #ffffff'}} className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Token Playground</h2>
      {isLoading ? (
        <div className="text-center">
          <p className="text-gray-500">Loading tokens...</p>
        </div>
      ) : tokens.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500">You don't have any tokens yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {tokens.map((token) => (
            <div key={token.publicKey} className="p-4 rounded-md cursor-pointer" style={{backgroundColor: '#e0e5ec', boxShadow: '9px 9px 16px #a3b1c6, -9px -9px 16px #ffffff'}} onClick={handleTokenClick}>
              <img src={token.sprite} alt="token sprite" className="w-24 h-24 mx-auto" />
              <p className="text-center mt-2 text-sm font-medium text-gray-900">{token.amount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}