import * as anchor from "@project-serum/anchor";
import { WalletNotSelectedError } from "@solana/wallet-adapter-react";
import { STABLE_POOL_IDL, STABLE_POOL_PROGRAM_ID } from "./const";

export function getProgramInstance(connection: any, wallet: any) {
  if (!wallet.publicKey) return WalletNotSelectedError;

  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions()
  );

  const idl = STABLE_POOL_IDL;

  const programId = STABLE_POOL_PROGRAM_ID;

  const program = new anchor.Program(idl as any, programId, provider);

  return program as any;
}
