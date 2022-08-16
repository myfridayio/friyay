import { getArts } from 'frakt-client';
import {
  Connection,
  PublicKey,
} from '@solana/web3.js';

  const fraktProgramPubKey = new PublicKey("CShFbsupuRApvsKr6ibCrDoxFnCmx72poN9hpsRbq6Fn")
  const connection = new Connection("https://api.devnet.solana.com", "processed")
  const arts = await getArts(fraktProgramPubKey, { connection })
  console.log(arts)
