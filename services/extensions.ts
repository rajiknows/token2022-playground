import {
    createInitializeMintCloseAuthorityInstruction,
    createInitializeMintInstruction,
    createInitializeTransferFeeConfigInstruction,
    ExtensionType,
    getMintLen,
    TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
} from "@solana/web3.js";

export class Extensions {
    publicKey: PublicKey;
    connection: Connection;

    constructor(publicKey: PublicKey, connection: any) {
        this.publicKey = publicKey;
        this.connection = connection;
    }

    mintCloseAuthority = async (
        mintAuthority: Keypair,
        freezeAuthority: Keypair,
        closeAuthority: Keypair,
        mintKeypair: Keypair,
    ) => {
        const payer = this.publicKey;
        const mint = mintKeypair.publicKey;

        const extensions = [ExtensionType.MintCloseAuthority];
        const mintLen = getMintLen(extensions);
        const lamports =
            await this.connection.getMinimumBalanceForRentExemption(mintLen);

        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: payer,
                newAccountPubkey: mint,
                space: mintLen,
                lamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeMintCloseAuthorityInstruction(
                mint,
                closeAuthority.publicKey,
                TOKEN_2022_PROGRAM_ID,
            ),
            createInitializeMintInstruction(
                mint,
                9,
                mintAuthority.publicKey,
                freezeAuthority.publicKey,
                TOKEN_2022_PROGRAM_ID,
            ),
        );
        return transaction;
    };

    transferFee = async (
        maxFee: bigint,
        decimals: number,
        feeBasisPoints: number,
        mintAuthority: Keypair,
        mintKeypair: Keypair,
        transferFeeConfigAuthority: Keypair,
        withdrawWithheldAuthority: Keypair,
    ) => {
        const payer = this.publicKey;
        const mint = mintKeypair.publicKey;

        const extensions = [ExtensionType.TransferFeeConfig];

        const mintLen = getMintLen(extensions);

        const mintLamports =
            await this.connection.getMinimumBalanceForRentExemption(mintLen);
        const mintTransaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: payer,
                newAccountPubkey: mint,
                space: mintLen,
                lamports: mintLamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeTransferFeeConfigInstruction(
                mint,
                transferFeeConfigAuthority.publicKey,
                withdrawWithheldAuthority.publicKey,
                feeBasisPoints,
                maxFee,
                TOKEN_2022_PROGRAM_ID,
            ),
            createInitializeMintInstruction(
                mint,
                decimals,
                mintAuthority.publicKey,
                null,
                TOKEN_2022_PROGRAM_ID,
            ),
        );
        return mintTransaction;
    };
}
