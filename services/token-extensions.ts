import {
    createInitializeMintCloseAuthorityInstruction,
    createInitializeMintInstruction,
    createInitializeTransferFeeConfigInstruction,
    createInitializePermanentDelegateInstruction,
    createInitializeTransferHookInstruction,
    createInitializeMetadataPointerInstruction,
    createInitializeGroupPointerInstruction,
    createInitializeGroupMemberPointerInstruction,
    createInitializeDefaultAccountStateInstruction,
    createInitializeNonTransferableMintInstruction,
    createInitializeInterestBearingMintInstruction,
    createInitializeImmutableOwnerInstruction,
    getMintLen,
    TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
} from "@solana/web3.js";

export class TokenExtensions {
    publicKey: PublicKey;
    connection: Connection;

    constructor(publicKey: PublicKey, connection: any) {
        this.publicKey = publicKey;
        this.connection = connection;
    }

    async createMintCloseAuthorityInstruction(
        mint: PublicKey,
        closeAuthority: PublicKey,
    ) {
        const extensions = [ExtensionType.MintCloseAuthority];
        const mintLen = getMintLen(extensions);
        const lamports =
            await this.connection.getMinimumBalanceForRentExemption(mintLen);

        return new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: this.publicKey,
                newAccountPubkey: mint,
                space: mintLen,
                lamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeMintCloseAuthorityInstruction(
                mint,
                closeAuthority,
                TOKEN_2022_PROGRAM_ID,
            ),
        );
    }

    createReallocateInstruction = () => new Transaction();

    async createPausableInstruction(
        mint: PublicKey,
        pauseAuthority: PublicKey,
    ) {
        const extensions = [ExtensionType.Pausable];
        const mintLen = getMintLen(extensions);
        const lamports =
            await this.connection.getMinimumBalanceForRentExemption(mintLen);

        return new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: this.publicKey,
                newAccountPubkey: mint,
                space: mintLen,
                lamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeMintInstruction(
                mint,
                9,
                this.publicKey,
                pauseAuthority,
                TOKEN_2022_PROGRAM_ID,
            ),
        );
    }

    async createTransferFeeInstruction(
        mint: PublicKey,
        transferFeeConfigAuthority: PublicKey,
        withdrawWithheldAuthority: PublicKey,
        feeBasisPoints: number,
        maxFee: bigint,
    ) {
        const extensions = [ExtensionType.TransferFeeConfig];
        const mintLen = getMintLen(extensions);
        const lamports =
            await this.connection.getMinimumBalanceForRentExemption(mintLen);

        return new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: this.publicKey,
                newAccountPubkey: mint,
                space: mintLen,
                lamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeTransferFeeConfigInstruction(
                mint,
                transferFeeConfigAuthority,
                withdrawWithheldAuthority,
                feeBasisPoints,
                maxFee,
                TOKEN_2022_PROGRAM_ID,
            ),
        );
    }

    async createPermanentDelegateInstruction(
        mint: PublicKey,
        delegate: PublicKey,
    ) {
        const extensions = [ExtensionType.PermanentDelegate];
        const mintLen = getMintLen(extensions);
        const lamports =
            await this.connection.getMinimumBalanceForRentExemption(mintLen);

        return new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: this.publicKey,
                newAccountPubkey: mint,
                space: mintLen,
                lamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializePermanentDelegateInstruction(
                mint,
                delegate,
                TOKEN_2022_PROGRAM_ID,
            ),
        );
    }

    async createTransferHookInstruction(
        mint: PublicKey,
        authority: PublicKey,
        programId: PublicKey,
    ) {
        const extensions = [ExtensionType.TransferHook];
        const mintLen = getMintLen(extensions);
        const lamports =
            await this.connection.getMinimumBalanceForRentExemption(mintLen);

        return new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: this.publicKey,
                newAccountPubkey: mint,
                space: mintLen,
                lamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeTransferHookInstruction(
                mint,
                authority,
                programId,
                TOKEN_2022_PROGRAM_ID,
            ),
        );
    }

    async createMetadataPointerInstruction(
        mint: PublicKey,
        authority: PublicKey,
        metadataAddress: PublicKey,
    ) {
        const extensions = [ExtensionType.MetadataPointer];
        const mintLen = getMintLen(extensions);
        const lamports =
            await this.connection.getMinimumBalanceForRentExemption(mintLen);

        return new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: this.publicKey,
                newAccountPubkey: mint,
                space: mintLen,
                lamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeMetadataPointerInstruction(
                mint,
                authority,
                metadataAddress,
                TOKEN_2022_PROGRAM_ID,
            ),
        );
    }

    async createGroupPointerInstruction(
        mint: PublicKey,
        authority: PublicKey,
        groupAddress: PublicKey,
    ) {
        const extensions = [ExtensionType.GroupPointer];
        const mintLen = getMintLen(extensions);
        const lamports =
            await this.connection.getMinimumBalanceForRentExemption(mintLen);

        return new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: this.publicKey,
                newAccountPubkey: mint,
                space: mintLen,
                lamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeGroupPointerInstruction(
                mint,
                authority,
                groupAddress,
                TOKEN_2022_PROGRAM_ID,
            ),
        );
    }

    async createGroupMemberPointerInstruction(
        mint: PublicKey,
        authority: PublicKey,
        memberAddress: PublicKey,
    ) {
        const extensions = [ExtensionType.GroupMemberPointer];
        const mintLen = getMintLen(extensions);
        const lamports =
            await this.connection.getMinimumBalanceForRentExemption(mintLen);

        return new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: this.publicKey,
                newAccountPubkey: mint,
                space: mintLen,
                lamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeGroupMemberPointerInstruction(
                mint,
                authority,
                memberAddress,
                TOKEN_2022_PROGRAM_ID,
            ),
        );
    }

    async createDefaultAccountStateInstruction(mint: PublicKey, state: any) {
        const extensions = [ExtensionType.DefaultAccountState];
        const mintLen = getMintLen(extensions);
        const lamports =
            await this.connection.getMinimumBalanceForRentExemption(mintLen);

        return new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: this.publicKey,
                newAccountPubkey: mint,
                space: mintLen,
                lamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeDefaultAccountStateInstruction(
                mint,
                state,
                TOKEN_2022_PROGRAM_ID,
            ),
        );
    }

    async createNonTransferableTokensInstruction(mint: PublicKey) {
        const extensions = [ExtensionType.NonTransferable];
        const mintLen = getMintLen(extensions);
        const lamports =
            await this.connection.getMinimumBalanceForRentExemption(mintLen);

        return new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: this.publicKey,
                newAccountPubkey: mint,
                space: mintLen,
                lamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeNonTransferableMintInstruction(
                mint,
                TOKEN_2022_PROGRAM_ID,
            ),
        );
    }

    async createInterestBearingTokensInstruction(
        mint: PublicKey,
        rateAuthority: PublicKey,
        rate: number,
    ) {
        const extensions = [ExtensionType.InterestBearingConfig];
        const mintLen = getMintLen(extensions);
        const lamports =
            await this.connection.getMinimumBalanceForRentExemption(mintLen);

        return new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: this.publicKey,
                newAccountPubkey: mint,
                space: mintLen,
                lamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeInterestBearingMintInstruction(
                mint,
                rateAuthority,
                rate,
                TOKEN_2022_PROGRAM_ID,
            ),
        );
    }

    async createTokenMetadataInstruction(
        mint: PublicKey,
        name: string,
        symbol: string,
        uri: string,
    ) {
        const extensions = [ExtensionType.TokenMetadata];
        const mintLen = getMintLen(extensions);
        const lamports =
            await this.connection.getMinimumBalanceForRentExemption(mintLen);

        return new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: this.publicKey,
                newAccountPubkey: mint,
                space: mintLen,
                lamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeTokenMetadataInstruction(
                mint,
                this.publicKey,
                mint,
                this.publicKey,
                name,
                symbol,
                uri,
                TOKEN_2022_PROGRAM_ID,
            ),
        );
    }

    async createImmutableOwnerInstruction(account: PublicKey) {
        return new Transaction().add(
            createInitializeImmutableOwnerInstruction(
                account,
                TOKEN_2022_PROGRAM_ID,
            ),
        );
    }

    async createCpiGuardInstruction(account: PublicKey, owner: PublicKey) {
        return new Transaction().add(
            createInitializeCpiGuardInstruction(
                account,
                owner,
                TOKEN_2022_PROGRAM_ID,
            ),
        );
    }

    createRequiredMemoOnTransferInstruction = () => new Transaction();
    createGroupInstruction = () => new Transaction();
    createMemberInstruction = () => new Transaction();
    createScaledUiAmountInstruction = () => new Transaction();
}
