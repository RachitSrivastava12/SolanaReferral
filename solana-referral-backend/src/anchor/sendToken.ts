import {
    getAssociatedTokenAddress,
    getAccount,
    createAssociatedTokenAccountInstruction,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey, Transaction, Keypair } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { connection, program } from "./solanaClient";
import fs from "fs";
import path from "path";
import keair from "./keypair";

// If you intentionally want to send from a specific local keypair,
// keep this loader. (Make sure this keypair ALSO owns the sender's ATA.)
const loadSenderKeypair = () => {
    return Keypair.fromSecretKey(new Uint8Array(keair));
};

export const sendToken = async (
    mintAddress: string,
    receiverSolAddress: string,
    amount: number // amount in the token's smallest units (respect decimals!)
) => {
    // NOTE: amount MUST be raw units. If your mint has 9 decimals and you want to send 1 token,
    // pass 1_000_000_000 (not 1).
    const senderKeypair = loadSenderKeypair();

    try {
        const mint = new PublicKey(mintAddress);
        const receiver = new PublicKey(receiverSolAddress);
        const sender = senderKeypair.publicKey;

        // Derive ATAs
        const senderTokenAccount = await getAssociatedTokenAddress(mint, sender);
        const receiverTokenAccount = await getAssociatedTokenAddress(mint, receiver);

        console.log("Sender token account:", senderTokenAccount.toString());
        console.log("Receiver token account:", receiverTokenAccount.toString());

        const tx = new Transaction();

        // Ensure receiver ATA exists
        try {
            await getAccount(connection, receiverTokenAccount);
        } catch {
            console.log("Creating associated token account for receiver");
            tx.add(
                createAssociatedTokenAccountInstruction(
                    sender, // payer
                    receiverTokenAccount,
                    receiver,
                    mint
                )
            );
        }

        // Add program instruction and FORCE writable metas in case your IDL in the running process is stale
        const ix = await program.methods
            .sendToken(new anchor.BN(amount))
            .accounts({
                from_token_account: senderTokenAccount,
                to_token_account: receiverTokenAccount,
                authority: sender,
                token_program: TOKEN_PROGRAM_ID,
            })
            .remainingAccounts([
                { pubkey: senderTokenAccount, isWritable: true, isSigner: false },
                { pubkey: receiverTokenAccount, isWritable: true, isSigner: false },
            ])
            .instruction();

        tx.add(ix);

        // Recent blockhash & fee payer
        const { blockhash } = await connection.getLatestBlockhash();
        tx.recentBlockhash = blockhash;
        tx.feePayer = sender;

        // Sign & send
        tx.sign(senderKeypair);
        const txSig = await connection.sendRawTransaction(tx.serialize(), {
            skipPreflight: false,
        });
        await connection.confirmTransaction(txSig, "confirmed");

        console.log("✅ Transaction signature:", txSig);
        return txSig;
    } catch (err: any) {
        // Better error surface: print sim logs if present
        try {
            // @solana/web3.js v1.95+ throws SendTransactionError with logs
            if (err?.logs) {
                console.error("Simulation logs:\n", err.logs.join("\n"));
            } else if (err?.transactionLogs) {
                console.error("Simulation logs:\n", err.transactionLogs.join("\n"));
            }
        } catch (_) {}
        console.error("❌ Error sending tokens:", err?.message ?? err);
        throw err;
    }
};
