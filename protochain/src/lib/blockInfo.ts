/**
 * The BlockInfo interface defines the structure for block metadata used in the blockchain.
 */

import Transaction from "./transaction";

export default interface BlockInfo {
    index: number;
    PreviousHash: string;
    difficulty: number;
    maxdifficulty: number;
    feeperTx: number;
    transactions: Transaction[];
}