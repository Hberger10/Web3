import Transaction from './transaction.js';

export default interface TransactionSearch {
    transaction: Transaction;
    mempoolIndex: number;
    blockIndex: number;
}