import { PublicKey } from '@solana/web3.js';
import { Wallet, Connection } from 'src';
import { SetStore, Store } from '../programs';
import { sendTransaction } from './transactions';

interface IInitStoreParams {
  connection: Connection;
  wallet: Wallet;
  isPublic: boolean;
}

interface IInitStoreResponse {
  storeId: PublicKey;
  txId: string;
}

export const initStore = async ({
  connection,
  wallet,
  isPublic = true,
}: IInitStoreParams): Promise<IInitStoreResponse> => {
  const storeId = await Store.getPDA(wallet.publicKey);
  const tx = new SetStore(
    { feePayer: wallet.publicKey },
    {
      admin: new PublicKey(wallet.publicKey),
      store: storeId,
      isPublic,
    },
  );

  const txId = await sendTransaction({ connection, wallet, txs: [tx] });

  return { storeId, txId };
};
