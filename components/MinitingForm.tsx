"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
    Keypair,
    PublicKey,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
    createMint,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    mintTo,
    TOKEN_PROGRAM_ID,
    createMintToInstruction,
} from "@solana/spl-token";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";

export default function MintingForm() {
    const { connection } = useConnection();
    const { publicKey, sendTransaction, signTransaction } = useWallet();
    const [decimals, setDecimals] = useState(9);
    const [mintAmount, setMintAmount] = useState(1000);
    const [isLoading, setIsLoading] = useState(false);
    const [signature, setSignature] = useState("");
    const [error, setError] = useState("");

    const handleMint = async () => {
        if (!publicKey || !signTransaction) {
            setError("Wallet not connected");
            throw new WalletNotConnectedError();
        }

        setIsLoading(true);
        setError("");
        setSignature("");
        try {
            const mintKeypair = Keypair.generate();

            const mint = await createMint(
                connection,
                mintKeypair,
                publicKey,
                null,
                decimals,
                mintKeypair,
            );

            const ata = await getAssociatedTokenAddress(mint, publicKey);

            const ataIx = createAssociatedTokenAccountInstruction(
                publicKey,
                ata,
                publicKey,
                mint,
            );

            const mintIx = createMintToInstruction(
                mint,
                ata,
                publicKey,
                BigInt(mintAmount) * BigInt(10 ** decimals),
            );

            const tx = new Transaction().add(ataIx).add(mintIx);

            const sig = await sendTransaction(tx, connection);

            await connection.confirmTransaction(sig, "confirmed");

            setSignature(sig);
        } catch (err: any) {
            setError(err.message || "Mint failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 border rounded-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">
                Create a Token
            </h2>
            <div className="flex flex-col gap-4">
                <input
                    type="number"
                    value={decimals}
                    onChange={(e) => setDecimals(parseInt(e.target.value))}
                    placeholder="Decimals"
                    className="input input-bordered w-full"
                />
                <input
                    type="number"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(parseInt(e.target.value))}
                    placeholder="Amount"
                    className="input input-bordered w-full"
                />
                <button
                    className="btn btn-primary w-full"
                    onClick={handleMint}
                    disabled={isLoading || !publicKey}
                >
                    {isLoading
                        ? "Minting..."
                        : !publicKey
                          ? "Connect Wallet to Mint"
                          : "Mint Token"}
                </button>

                {signature && (
                    <div className="alert alert-success">
                        <a
                            href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                            target="_blank"
                            rel="noreferrer"
                            className="link"
                        >
                            {signature}
                        </a>
                    </div>
                )}

                {error && (
                    <div className="alert alert-error">
                        <p>{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
