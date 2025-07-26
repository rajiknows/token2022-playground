"use client";
"use client";

import TokenStudio from "../components/TokenStudio";
import TokenPlayground from "../components/TokenPlayground";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import "@solana/wallet-adapter-react-ui/styles.css";

export default function Home() {
  return (
    <div className="min-h-screen" style={{backgroundColor: '#e0e5ec'}}>
      <header className="py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Solana Token Creator</h1>
          <WalletMultiButton style={{backgroundColor: '#e0e5ec', boxShadow: '9px 9px 16px #a3b1c6, -9px -9px 16px #ffffff'}} />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <TokenStudio />
          </div>
          <div>
            <TokenPlayground />
          </div>
        </div>
      </main>
    </div>
  );
}
