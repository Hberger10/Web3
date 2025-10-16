import transactionType from '../transactionType';    
import { SHA256 } from 'crypto-js';
import validation from '../validation';
/**
 * Mocked Transaction class for testing purposes
 */


export default class Transaction {
    type: transactionType;
    timestamp: number;
    hash: string;
    data: string;
    

    constructor(tx?: Transaction) {
        this.type= tx?.type || transactionType.REGULAR;
        this.timestamp= tx?.timestamp || Date.now();
        this.data= tx?.data || "tx1";
        this.hash=tx?.hash || this.getHash();

    }

    
    getHash():string {
        return "abc";

    }

    isvalid(): validation{
        if (!this.data)
            return new validation(false,"invalid mock transaction")

        return new validation();
    }
        
        }
        

