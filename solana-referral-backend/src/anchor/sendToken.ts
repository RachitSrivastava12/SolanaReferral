import {
    getAssociatedTokenAddress,
    getAccount,
    createAssociatedTokenAccountInstruction,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";
import * as anchor from '@project-serum/anchor';
import { connection, program, provider } from "./solanaClient";

export const sendToken = async (
    mintAddress: string,
    receiverSolAddress: string,
    amount: number
) => {
    try {
        const mint = new PublicKey(mintAddress);
        const receiver = new PublicKey(receiverSolAddress);
        const sender = provider.wallet.publicKey;

        // Derive sender and receiver token accounts
        const senderTokenAccount = await getAssociatedTokenAddress(mint, sender);
        console.log("Sender token account:", senderTokenAccount.toString());
        const receiverTokenAccount = await getAssociatedTokenAddress(mint, receiver);
        console.log("Receiver token account:", receiverTokenAccount.toString());

        const tx = new Transaction();

        // Check if receiver token account exists, if not, create it
        try {
            await getAccount(connection, receiverTokenAccount);
        } catch (err) {
            console.log("Creating associated token account for receiver");
            tx.add(
                createAssociatedTokenAccountInstruction(
                    sender,                // payer
                    receiverTokenAccount,  // ata
                    receiver,              // owner of ata
                    mint                   // mint
                )
            );
        }

        // Add the Anchor program instruction to send tokens
        // NOTE: Use snake_case to match the Rust contract account names
        tx.add(
            await program.methods
                .sendToken(new anchor.BN(amount))
                .accounts({
                    from_token_account: senderTokenAccount,  // Changed from fromTokenAccount
                    to_token_account: receiverTokenAccount,   // Changed from toTokenAccount
                    authority: sender,
                    token_program: TOKEN_PROGRAM_ID,          // Changed from tokenProgram
                })
                .instruction()
        );

        // Send transaction
        const txSig = await provider.sendAndConfirm(tx);
        console.log("Transaction signature:", txSig);
        return txSig;

    } catch (err) {
        console.error("Error sending tokens:", err);
        throw err;
    }
};