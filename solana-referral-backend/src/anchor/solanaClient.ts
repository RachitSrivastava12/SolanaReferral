import * as anchor from '@project-serum/anchor';
import { Connection } from "@solana/web3.js";
import fs from 'fs';
import path from "node:path";

// Read IDL and wallet with proper error handling
let idl: any;
let walletKey: number[];

try {
    idl = JSON.parse(fs.readFileSync(path.join(__dirname, "idl.json"), "utf8"));
} catch (error) {
    console.error("Error reading idl.json:", error);
    throw new Error("Failed to read IDL file");
}

try {
    walletKey = JSON.parse(fs.readFileSync(path.join(__dirname, "keypair.json"), "utf8"));
} catch (error) {
    console.error("Error reading keypair.json:", error);
    throw new Error("Failed to read keypair file");
}

// Create wallet and connection
const wallet = anchor.web3.Keypair.fromSecretKey(new Uint8Array(walletKey));
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
const walletWrapper = new anchor.Wallet(wallet);
const provider = new anchor.AnchorProvider(connection, walletWrapper, {
    preflightCommitment: 'confirmed',
    commitment: 'confirmed'
});

anchor.setProvider(provider);

const programId = new anchor.web3.PublicKey('AsykMkUJfeagXTQa2KDgDhMLAGPPi1K6rLS2pwXHtgjx');
const program = new anchor.Program(idl, programId, provider);

// Log wallet public key for debugging
console.log("Wallet public key:", wallet.publicKey.toString());

export { connection, program, provider, wallet };