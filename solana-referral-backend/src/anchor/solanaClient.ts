import * as anchor from "@project-serum/anchor";
import { Connection, Keypair } from "@solana/web3.js";
import { readFileSync } from "fs";
import path from "path";

// Load your program IDL
import idl from "./idl";

// Program ID from your IDL file
const PROGRAM_ID = new anchor.web3.PublicKey(idl.address);

// Network configuration - CHANGE THIS BASED ON WHERE YOUR PROGRAM IS DEPLOYED
const NETWORK = "devnet"; // or 'mainnet-beta' or 'http://localhost:8899'
const connection = new Connection(
  NETWORK === "devnet"
    ? "https://api.devnet.solana.com"
    : NETWORK === "mainnet-beta"
    ? "https://api.mainnet-beta.solana.com"
    : "http://localhost:8899"
);

// Load wallet (first try env var, then fallback to file)
let wallet: anchor.Wallet;
try {
  let keypair: Keypair;

  if (process.env.secretKey) {
    // Load from environment variable
    const secretKey = Uint8Array.from(JSON.parse(process.env.secretKey));
    keypair = Keypair.fromSecretKey(secretKey);
    console.log("✅ Loaded wallet from env var `secretKey`");
  } else {
    // Fallback for local dev
    const keypairPath =
      process.env.SOLANA_KEYPAIR_PATH ||
      path.join(process.env.HOME || "", ".config/solana/id.json");
    const keypairData = JSON.parse(readFileSync(keypairPath, "utf8"));
    keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
    console.log("✅ Loaded wallet from keypair file:", keypairPath);
  }

  wallet = new anchor.Wallet(keypair);
  console.log("Wallet public key:", wallet.publicKey.toString());
} catch (error) {
  console.error("❌ Failed to load wallet:", error);
  process.exit(1);
}

// Create provider
const provider = new anchor.AnchorProvider(connection, wallet, {
  commitment: "confirmed",
});

// Set as default provider
anchor.setProvider(provider);

// Create program instance
const program = new anchor.Program(idl as any, PROGRAM_ID, provider);

// Verify program exists on the network
async function verifyProgramExists() {
  try {
    const programInfo = await connection.getAccountInfo(PROGRAM_ID);
    if (!programInfo) {
      console.error(
        `❌ Program ${PROGRAM_ID.toString()} does not exist on ${NETWORK}`
      );
      console.log("Please deploy your program first using: anchor deploy");
      process.exit(1);
    }
    console.log(`✅ Program ${PROGRAM_ID.toString()} found on ${NETWORK}`);
    console.log(`✅ Program authority: ${programInfo.owner.toString()}`);
  } catch (error) {
    console.error("Error checking program:", error);
    process.exit(1);
  }
}

// Call verification on module load
verifyProgramExists();

export { connection, program, provider, wallet };
