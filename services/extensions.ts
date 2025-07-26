import {
  createInitializeMintCloseAuthorityInstruction,
  createInitializeMintInstruction,
  createInitializeTransferFeeConfigInstruction,
  ExtensionType,
  getMintLen,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

class Extensions {
  keypair: Keypair;
  connection: Connection;

  constructor(keypair: Keypair, connection: any) {
    this.keypair = keypair;
    this.connection = connection;
  }

  mintCloseAuthority = async (
    mintAuthority: Keypair,
    freezeAuthority: Keypair,
    closeAuthority: Keypair,
  ) => {
    const payer = this.keypair;
    const mintKeypair = Keypair.generate();
    const mint = mintKeypair.publicKey;
    // const mintAuthority = Keypair.generate();
    // const freezeAuthority = Keypair.generate();
    // const closeAuthority = Keypair.generate();

    // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    // const airdropSignature = await connection.requestAirdrop(payer.publicKey, 2 * LAMPORTS_PER_SOL);
    // await connection.confirmTransaction({ signature: airdropSignature, ...(await connection.getLatestBlockhash()) });

    const extensions = [ExtensionType.MintCloseAuthority];
    const mintLen = getMintLen(extensions);
    const lamports = await this.connection.getMinimumBalanceForRentExemption(
      mintLen,
    );

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
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
    await sendAndConfirmTransaction(this.connection, transaction, [
      payer,
      mintKeypair,
    ], undefined);
  };

  transferFeee = async (
    maxFee: bigint,
    decimals: number,
    feeBasisPoints: number,
    mintAuthority: Keypair,
    mintKeypair: Keypair,
    transferFeeConfigAuthority: Keypair,
    withdrawWithheldAuthority: Keypair,
  ) => {
    const payer = this.keypair;

    // const mintAuthority = Keypair.generate();
    // const mintKeypair = Keypair.generate();
    const mint = mintKeypair.publicKey;
    // const transferFeeConfigAuthority = Keypair.generate();
    // const withdrawWithheldAuthority = Keypair.generate();

    const extensions = [ExtensionType.TransferFeeConfig];

    const mintLen = getMintLen(extensions);
    // const decimals = 9;
    // const feeBasisPoints = 50;
    // const maxFee = BigInt(5_000);

    // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    const airdropSignature = await this.connection.requestAirdrop(
      payer.publicKey,
      2 * LAMPORTS_PER_SOL,
    );
    await this.connection.confirmTransaction({
      signature: airdropSignature,
      ...(await this.connection.getLatestBlockhash()),
    });

    const mintLamports = await this.connection
      .getMinimumBalanceForRentExemption(mintLen);
    const mintTransaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
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
    await sendAndConfirmTransaction(this.connection, mintTransaction, [
      payer,
      mintKeypair,
    ], undefined);
  };
}
