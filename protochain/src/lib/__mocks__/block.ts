import validation from '../validation';
import BlockInfo from '../blockInfo';
import Transaction from './transaction';
import TransactionType from '../transactionType';



/**
 * Mocked block Class
 */
//criando uma classe de bloco e exportando ela futuramente para o blockchain
export default class Block {
    index: number;
    timestamp: number;
    hash: string;
    previousHash: string;
    transactions: Transaction[];
    nonce: number;
    miner: string;  
  
/**
 * Creates a new mock block
 * @param block The mock block
 */
  constructor(block?: Block) {
        this.index = block?.index || 0;
        this.timestamp = block?.timestamp || Date.now();
        this.previousHash = block?.previousHash || "";

        this.transactions = block?.transactions
            ? block.transactions.map(tx => new Transaction(tx))
            : [] as Transaction[];

        this.nonce = block?.nonce || 0;
        this.miner = block?.miner || "";
        this.hash = block?.hash || this.getHash();
    }

  getHash(): string {
    return this.hash || "abc";//calcula e retorna tudo isso como string sha256
  }
/**
 * validates the mock block
 * @returns returns if the block is valid
 */
  isvalid(hashPrevious: string,previousIndex: number): validation {
  if (!hashPrevious || previousIndex<0 || this.index<0) return new validation(false,"invalid index or hashPrevious."); 
  return new validation();
}

mine(difficulty: number, miner: string) {
        this.miner = miner;
        const prefix = new Array(difficulty + 1).join("0");

        do {
            this.nonce++;
            this.hash = this.getHash();
        }
        while (!this.hash.startsWith(prefix));
    }

}