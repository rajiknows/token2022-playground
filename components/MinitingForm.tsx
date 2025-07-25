"use client";
import { getCreateAccountInstruction } from "@solana-program/system";
import {
    findAssociatedTokenPda,
    getCreateAssociatedTokenInstructionAsync,
    getInitializeMintInstruction,
    getMintSize,
    getMintToCheckedInstruction,
    TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import {
    airdropFactory,
    appendTransactionMessageInstructions,
    createSolanaRpc,
    createSolanaRpcSubscriptions,
    createTransactionMessage,
    generateKeyPairSigner,
    getSignatureFromTransaction,
    lamports,
    pipe,
    sendAndConfirmTransactionFactory,
    setTransactionMessageFeePayerSigner,
    setTransactionMessageLifetimeUsingBlockhash,
    signTransactionMessageWithSigners,
} from "@solana/kit";

const rpc = createSolanaRpc("http://localhost:8899");
const rpcSubscriptions = createSolanaRpcSubscriptions("ws://localhost:8900");

/* constants */
const MINT_AUTHORITY = await generateKeyPairSigner();
const DECIMALS = 9;
const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

let { mint, associatedTokenAddress } = await setup();

const mintToIx = await getMintToCheckedInstruction({
    mint,
    token: associatedTokenAddress,
    mintAuthority: MINT_AUTHORITY,
    amount: 1_000_000_000n, // 1
    decimals: DECIMALS,
});

const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayerSigner(MINT_AUTHORITY, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstructions([mintToIx], tx),
);

const signedTransaction =
    await signTransactionMessageWithSigners(transactionMessage);

await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(
    signedTransaction,
    { commitment: "confirmed" },
);

const txSignature = getSignatureFromTransaction(signedTransaction);
console.log("Transaction Signature: ", txSignature);

/*
 * The setup function initializes the mint and token accounts
 *
 */
async function setup() {
    await airdropFactory({ rpc, rpcSubscriptions })({
        recipientAddress: MINT_AUTHORITY.address,
        lamports: lamports(1_000_000_000n), // 1 SOL
        commitment: "confirmed",
    });

    const mint = await generateKeyPairSigner();

    const space = BigInt(getMintSize());

    const rent = await rpc.getMinimumBalanceForRentExemption(space).send();

    // create & initialize mint account
    const createAccountInstruction = getCreateAccountInstruction({
        payer: MINT_AUTHORITY,
        newAccount: mint,
        lamports: rent,
        space,
        programAddress: TOKEN_2022_PROGRAM_ADDRESS,
    });

    const initializeMintInstruction = getInitializeMintInstruction({
        mint: mint.address,
        decimals: DECIMALS,
        mintAuthority: MINT_AUTHORITY.address,
    });

    // create token account
    const [associatedTokenAddress] = await findAssociatedTokenPda({
        mint: mint.address,
        owner: MINT_AUTHORITY.address,
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
    });

    const createAtaInstruction = await getCreateAssociatedTokenInstructionAsync(
        {
            payer: MINT_AUTHORITY,
            mint: mint.address,
            owner: MINT_AUTHORITY.address,
        },
    );

    const instructions = [
        createAccountInstruction,
        initializeMintInstruction,
        createAtaInstruction,
    ];

    const transactionMessage = pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayerSigner(MINT_AUTHORITY, tx),
        (tx) =>
            setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
        (tx) => appendTransactionMessageInstructions(instructions, tx),
    );

    const signedTransaction =
        await signTransactionMessageWithSigners(transactionMessage);

    await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(
        signedTransaction,
        { commitment: "confirmed" },
    );

    return {
        mint: mint.address,
        associatedTokenAddress,
    };
}
